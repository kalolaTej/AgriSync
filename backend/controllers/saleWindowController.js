const supabase = require('../services/supabase');
const { calculateMatchScore } = require('../services/matchingService');

const calculateSaleWindow = async (lot) => {
  // Check Rule 1 — Sold lot
  if (lot.status === 'sold') {
    return {
      recommendation: 'NOT_APPLICABLE',
      label: 'Already Sold',
      reason: 'This lot has already been sold.',
      factors: [],
      data_status: 'live'
    };
  }

  const factors = [];
  
  // Grade factor
  if (lot.grade) {
    if (lot.grade === 'A') {
      factors.push({ factor: 'lot_grade', result: 'positive', detail: 'Lot has a higher recorded quality grade.' });
    } else if (lot.grade === 'C') {
      factors.push({ factor: 'lot_grade', result: 'negative', detail: 'Recorded grade C may limit buyer compatibility.' });
    } else {
      factors.push({ factor: 'lot_grade', result: 'neutral', detail: `Lot has recorded quality grade: ${lot.grade}` });
    }
  } else {
    factors.push({ factor: 'lot_grade', result: 'neutral', detail: 'Lot quality grading is pending.' });
  }

  // Check Market Data
  const marketLive = false; 
  let marketStatus = 'unavailable';

  if (!marketLive) {
    factors.push({ factor: 'market_data', result: 'unavailable', detail: 'Live mandi price data is not currently available.' });
  }

  // Check Buyer Matches (Demand)
  const { data: demandProfiles } = await supabase
    .from('buyer_demand_profiles')
    .select('*')
    .eq('active', true);
    
  const { data: existingMatches } = await supabase
    .from('buyer_matches')
    .select('*')
    .eq('lot_id', lot.id);

  let hasAccepted = false;
  let hasContacted = false;
  let dynamicMatches = 0;
  
  (existingMatches || []).forEach(m => {
    if (m.status === 'accepted') hasAccepted = true;
    if (m.status === 'contacted') hasContacted = true;
  });

  if (demandProfiles) {
    for (const profile of demandProfiles) {
      const { score } = calculateMatchScore(lot, profile);
      if (score > 0) dynamicMatches++;
    }
  }

  let buyerDemand = 'negative';
  if (hasAccepted) {
    buyerDemand = 'strong_positive';
    factors.push({ factor: 'buyer_demand', result: 'strong_positive', detail: 'An accepted buyer match exists.' });
  } else if (dynamicMatches > 0 || hasContacted) {
    buyerDemand = 'positive';
    factors.push({ factor: 'buyer_demand', result: 'positive', detail: `${dynamicMatches || 1} compatible buyer match(es) available.` });
  } else {
    factors.push({ factor: 'buyer_demand', result: 'negative', detail: 'No compatible buyer demand is currently recorded.' });
  }

  // Execute Rules based on factors
  
  // CRITICAL RULE: If market is unavailable, we MUST recommend MONITOR_MARKET regardless of demand.
  if (!marketLive) {
    return {
      recommendation: 'MONITOR_MARKET',
      label: 'Monitor Market',
      reason: 'Live mandi price data is not currently available. The system is not predicting future prices.',
      factors,
      data_status: marketStatus
    };
  }
  
  // At this point, marketLive is guaranteed TRUE.

  // Rule 4 & 5 — Market data available + strong demand
  if (buyerDemand === 'strong_positive') {
     return {
      recommendation: 'SELL_NOW',
      label: 'Sell Now',
      reason: 'An accepted buyer match exists and current market data is available. Proceed with procurement.',
      factors,
      data_status: marketStatus
    };
  }

  // Rule 5 — Market data available + demand exists
  if (buyerDemand === 'positive') {
    return {
      recommendation: 'SELL_NOW',
      label: 'Sell Now',
      reason: 'Compatible buyer demand is available and current market data is available.',
      factors,
      data_status: marketStatus
    };
  }

  // Rule 6 — Market data available but no demand
  if (buyerDemand === 'negative') {
    return {
      recommendation: 'MONITOR_MARKET',
      label: 'Monitor Market',
      reason: 'Current market data is available, but no compatible buyer demand is currently recorded.',
      factors,
      data_status: marketStatus
    };
  }

  // Rule 7 — Insufficient information fallback
  return {
    recommendation: 'MONITOR_MARKET',
    label: 'Monitor Market',
    reason: 'There is not enough current information to recommend an immediate sale.',
    factors,
    data_status: marketStatus
  };
};

// GET /api/lots/:lot_id/sale-window
exports.getSaleWindowRecommendation = async (req, res) => {
  try {
    const lotId = req.params.lot_id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const { data: lot, error: lotError } = await supabase
      .from('produce_lots')
      .select('*, farms(user_id, location)')
      .eq('id', lotId)
      .single();

    if (lotError || !lot) {
      return res.status(404).json({ error: 'Produce lot not found.' });
    }

    // Auth check
    if (userRole === 'farmer' && lot.farms?.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to view recommendations for this lot.' });
    }

    const recommendation = await calculateSaleWindow(lot);
    
    // Attach lot ID to result payload
    recommendation.lot_id = lotId;
    
    return res.status(200).json({ data: recommendation });
  } catch (error) {
    console.error('Error generating sale window recommendation:', error);
    return res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
};
