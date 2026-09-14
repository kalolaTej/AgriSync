/**
 * AgriSync - Market Controller
 * Mandi price aggregation, arbitrage analysis & interactive rule-based sale-window recommendation logic.
 * Owner: Tej
 */

const supabase = require('../services/supabaseClient');
const { getMandiPrices, getPriceTrend, getArbitrageOpportunities } = require('../services/agmarknetService');
const { MOCK_PRODUCE_LOTS } = require('../mock/marketMockData');

// Crop perishability classification for shelf-life estimation
const CROP_PERISHABILITY = {
  tomato: { type: 'perishable', maxShelfDays: 6, optimalHoldDays: 2, spoilageRatePerDay: 4.5 },
  cabbage: { type: 'perishable', maxShelfDays: 7, optimalHoldDays: 2, spoilageRatePerDay: 3.5 },
  cauliflower: { type: 'perishable', maxShelfDays: 6, optimalHoldDays: 2, spoilageRatePerDay: 4.0 },
  strawberry: { type: 'perishable', maxShelfDays: 4, optimalHoldDays: 1, spoilageRatePerDay: 8.0 },
  onion: { type: 'semi_perishable', maxShelfDays: 30, optimalHoldDays: 5, spoilageRatePerDay: 0.8 },
  potato: { type: 'semi_perishable', maxShelfDays: 45, optimalHoldDays: 7, spoilageRatePerDay: 0.5 },
  garlic: { type: 'semi_perishable', maxShelfDays: 60, optimalHoldDays: 10, spoilageRatePerDay: 0.4 },
  wheat: { type: 'durable', maxShelfDays: 180, optimalHoldDays: 10, spoilageRatePerDay: 0.05 },
  rice: { type: 'durable', maxShelfDays: 180, optimalHoldDays: 10, spoilageRatePerDay: 0.05 },
  soybean: { type: 'durable', maxShelfDays: 120, optimalHoldDays: 7, spoilageRatePerDay: 0.1 },
  cotton: { type: 'durable', maxShelfDays: 150, optimalHoldDays: 10, spoilageRatePerDay: 0.05 },
  maize: { type: 'durable', maxShelfDays: 120, optimalHoldDays: 7, spoilageRatePerDay: 0.1 },
};

/**
 * GET /api/prices?crop=<string>&state=<string>
 */
const getPrices = async (req, res) => {
  try {
    const { crop, state, limit } = req.query;
    const parsedLimit = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 50;

    const prices = await getMandiPrices({ crop, state, limit: parsedLimit });
    return res.status(200).json(prices);
  } catch (err) {
    console.error('[marketController getPrices error]', err);
    return res.status(500).json({ error: `Failed to fetch mandi prices: ${err.message}` });
  }
};

/**
 * GET /api/prices/trend?crop=<string>&market=<string>
 */
const getTrend = async (req, res) => {
  try {
    const { crop, market } = req.query;
    const trend = await getPriceTrend({ crop, market });
    return res.status(200).json(trend);
  } catch (err) {
    console.error('[marketController getTrend error]', err);
    return res.status(500).json({ error: `Failed to fetch price trend: ${err.message}` });
  }
};

/**
 * GET /api/prices/arbitrage?crop=<string>
 * Compares mandis across states to reveal highest paying regional markets
 */
const getArbitrage = async (req, res) => {
  try {
    const { crop } = req.query;
    const arbitrage = await getArbitrageOpportunities({ crop: crop || 'Tomato' });
    return res.status(200).json(arbitrage);
  } catch (err) {
    console.error('[marketController getArbitrage error]', err);
    return res.status(500).json({ error: `Failed to calculate arbitrage: ${err.message}` });
  }
};

/**
 * GET /api/lots/:id/sale-window
 */
const getSaleWindow = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Lot ID is required' });
    }

    let lot = null;
    try {
      const { data, error } = await supabase.from('produce_lots').select('*').eq('id', id).single();
      if (!error && data) lot = data;
    } catch (err) {
      console.debug(`[sale-window] DB query note: ${err.message}`);
    }

    if (!lot) {
      lot = MOCK_PRODUCE_LOTS.find((l) => l.id === id) || {
        id,
        crop_type: 'Tomato',
        quantity_kg: 1000,
        grade: 'A',
        harvest_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      };
    }

    const cropName = (lot.crop_type || 'Tomato').toLowerCase();
    const cropMeta = CROP_PERISHABILITY[cropName] || {
      type: 'semi_perishable',
      maxShelfDays: 20,
      optimalHoldDays: 3,
      spoilageRatePerDay: 1.0,
    };

    const harvestDate = lot.harvest_date ? new Date(lot.harvest_date) : new Date(Date.now() - 2 * 86400000);
    const today = new Date();
    const diffTime = Math.abs(today - harvestDate);
    const daysSinceHarvest = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    const trendData = await getPriceTrend({ crop: lot.crop_type });
    let trendDirection = 0;

    if (trendData && trendData.length >= 2) {
      const firstPrice = trendData[0].modal_price || 1;
      const lastPrice = trendData[trendData.length - 1].modal_price || 1;
      trendDirection = ((lastPrice - firstPrice) / firstPrice) * 100;
    }

    let recommendation = 'sell_now';
    let hold_days = null;
    let rationale = '';

    const shelfLifeRemaining = cropMeta.maxShelfDays - daysSinceHarvest;

    if (cropMeta.type === 'perishable' && shelfLifeRemaining <= 2) {
      recommendation = 'sell_now';
      hold_days = null;
      rationale = `Lot has been harvested for ${daysSinceHarvest} days. Perishable shelf-life limit approaching; sell now to prevent spoilage.`;
    } else if (trendDirection < -2.0) {
      recommendation = 'sell_now';
      hold_days = null;
      rationale = `Market prices have dropped by ${Math.abs(trendDirection).toFixed(1)}% recently. Sell now to protect current realization value.`;
    } else if (trendDirection > 2.5 && shelfLifeRemaining > cropMeta.optimalHoldDays) {
      recommendation = 'hold';
      hold_days = cropMeta.optimalHoldDays;
      const trendFormatted = trendDirection.toFixed(1);
      if (cropMeta.type === 'perishable') {
        rationale = `Prices have risen ${trendFormatted}% over recent days. Consider holding for ${hold_days} days to capture peak rates before freshness declines.`;
      } else if (cropMeta.type === 'durable') {
        rationale = `Steady upward price momentum (+${trendFormatted}%) with low storage risk. Holding for ${hold_days} days recommended for optimal realization.`;
      } else {
        rationale = `Favorable price rise of ${trendFormatted}% observed in regional mandis. Recommend holding ${hold_days} days while produce remains in prime condition.`;
      }
    } else {
      recommendation = 'sell_now';
      hold_days = null;
      rationale = `Prices remain stable (change: ${trendDirection.toFixed(1)}%) with negligible near-term appreciation expected. Sell now at current modal rates.`;
    }

    return res.status(200).json({
      lot_id: lot.id,
      recommendation,
      hold_days,
      rationale,
    });
  } catch (err) {
    console.error('[marketController getSaleWindow error]', err);
    return res.status(500).json({ error: `Failed to compute sale-window recommendation: ${err.message}` });
  }
};

/**
 * POST /api/sale-window/simulate
 * Interactive simulator calculating holding profitability vs spoilage risk
 */
const simulateSaleWindow = async (req, res) => {
  try {
    const {
      crop_type = 'Tomato',
      quantity_kg = 1000,
      days_since_harvest = 2,
      storage_condition = 'ambient', // 'ambient' | 'ventilated' | 'cold_storage'
      weather_condition = 'normal',   // 'hot_humid' | 'normal' | 'cool_dry'
    } = req.body;

    const cropName = crop_type.toLowerCase().trim();
    const meta = CROP_PERISHABILITY[cropName] || {
      type: 'semi_perishable',
      maxShelfDays: 20,
      optimalHoldDays: 4,
      spoilageRatePerDay: 1.0,
    };

    // Pull current price trend
    const trendData = await getPriceTrend({ crop: crop_type });
    let latestPricePerQtl = 2500;
    let dailyGrowthRatePct = 0.8;

    if (trendData && trendData.length > 0) {
      latestPricePerQtl = trendData[trendData.length - 1].modal_price || 2500;
      if (trendData.length >= 2) {
        const first = trendData[0].modal_price || 1;
        const last = trendData[trendData.length - 1].modal_price || 1;
        const totalGrowth = ((last - first) / first) * 100;
        dailyGrowthRatePct = Math.max(-5, Math.min(5, totalGrowth / Math.max(1, trendData.length)));
      }
    }

    // Storage modifier
    let storageMultiplier = 1.0;
    if (storage_condition === 'cold_storage') storageMultiplier = 0.2;
    else if (storage_condition === 'ventilated') storageMultiplier = 0.6;

    // Weather modifier
    let weatherMultiplier = 1.0;
    if (weather_condition === 'hot_humid') weatherMultiplier = 1.5;
    else if (weather_condition === 'cool_dry') weatherMultiplier = 0.7;

    const effectiveDailySpoilagePct = meta.spoilageRatePerDay * storageMultiplier * weatherMultiplier;
    const currentPricePerKg = latestPricePerQtl / 100;
    const immediateRevenue = Math.round(quantity_kg * currentPricePerKg);

    // Calculate outcomes across days (Day 0 to Day 7)
    const simulationTimeline = [];
    for (let day = 0; day <= 7; day++) {
      const cumulativeSpoilagePct = Math.min(100, day * effectiveDailySpoilagePct);
      const salableQuantity = Math.max(0, quantity_kg * (1 - cumulativeSpoilagePct / 100));
      const projectedPricePerQtl = Math.round(latestPricePerQtl * (1 + (day * dailyGrowthRatePct) / 100));
      const projectedPricePerKg = projectedPricePerQtl / 100;
      const projectedRevenue = Math.round(salableQuantity * projectedPricePerKg);
      const netProfitOrLoss = projectedRevenue - immediateRevenue;

      simulationTimeline.push({
        day,
        projected_modal_price_qtl: projectedPricePerQtl,
        salable_quantity_kg: Math.round(salableQuantity),
        spoilage_loss_kg: Math.round(quantity_kg - salableQuantity),
        projected_revenue: projectedRevenue,
        net_delta_vs_immediate: netProfitOrLoss,
      });
    }

    // Find optimal day
    const bestDayItem = simulationTimeline.reduce((max, cur) =>
      cur.projected_revenue > max.projected_revenue ? cur : max
    , simulationTimeline[0]);

    let recommendation = bestDayItem.day === 0 ? 'sell_now' : 'hold';
    let rationale = '';

    if (bestDayItem.day === 0 || bestDayItem.net_delta_vs_immediate <= 0) {
      recommendation = 'sell_now';
      rationale = `Immediate sale secures ₹${immediateRevenue.toLocaleString('en-IN')}. Holding is not advised as spoilage risk (${effectiveDailySpoilagePct.toFixed(1)}%/day) outweighs expected price gains.`;
    } else {
      recommendation = 'hold';
      rationale = `Holding for ${bestDayItem.day} days maximizes net revenue to ₹${bestDayItem.projected_revenue.toLocaleString('en-IN')} (gain of +₹${bestDayItem.net_delta_vs_immediate.toLocaleString('en-IN')}) after accounting for ${bestDayItem.spoilage_loss_kg} kg estimated spoilage loss.`;
    }

    return res.status(200).json({
      crop_type,
      quantity_kg,
      immediate_revenue: immediateRevenue,
      current_modal_price: latestPricePerQtl,
      daily_trend_rate_pct: parseFloat(dailyGrowthRatePct.toFixed(2)),
      effective_daily_spoilage_pct: parseFloat(effectiveDailySpoilagePct.toFixed(2)),
      optimal_holding_days: bestDayItem.day,
      max_projected_revenue: bestDayItem.projected_revenue,
      expected_gain: bestDayItem.net_delta_vs_immediate,
      recommendation,
      rationale,
      simulation_timeline: simulationTimeline,
    });
  } catch (err) {
    console.error('[simulateSaleWindow error]', err);
    return res.status(500).json({ error: `Simulation failed: ${err.message}` });
  }
};

module.exports = {
  getPrices,
  getTrend,
  getArbitrage,
  getSaleWindow,
  simulateSaleWindow,
};
