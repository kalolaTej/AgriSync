/**
 * AgriSync - AGMARKNET Government API Integration & Cache Service
 * Resource: data.gov.in "Current Daily Price of Various Commodities from Various Markets (Mandi)"
 * Owner: Tej
 */

const supabase = require('./supabaseClient');
const { MOCK_MANDI_PRICES } = require('../mock/marketMockData');

const AGMARKNET_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const AGMARKNET_BASE_URL = `https://api.data.gov.in/resource/${AGMARKNET_RESOURCE_ID}`;
const DEFAULT_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// In-memory runtime cache for quick repeated access and offline resilience
const memoryCache = new Map();

/**
 * Standardize arrival_date string (e.g., "14/09/2026" or "2026-09-14") to "YYYY-MM-DD"
 */
const parseArrivalDate = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const str = String(dateStr).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [day, month, year] = str.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.substring(0, 10);
  }
  return new Date().toISOString().split('T')[0];
};

/**
 * Fetch live mandi prices from data.gov.in AGMARKNET API
 * @param {Object} options
 * @param {string} [options.crop] - Commodity name (e.g. "Tomato", "Wheat")
 * @param {string} [options.state] - State name (e.g. "Andhra Pradesh", "Maharashtra")
 * @param {number} [options.limit=50] - Record limit
 * @returns {Promise<Array>} Array of price objects tagged source: "real"
 */
const fetchFromGovernmentApi = async ({ crop, state, limit = 50 }) => {
  const apiKey = process.env.AGMARKNET_API_KEY || DEFAULT_API_KEY;
  const url = new URL(AGMARKNET_BASE_URL);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', String(Math.min(limit, 100)));

  if (crop && crop !== 'All Crops') {
    url.searchParams.set('filters[commodity]', crop);
  }
  if (state && state !== 'All States') {
    url.searchParams.set('filters[state]', state);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for government servers

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`[agmarknet] HTTP 429: data.gov.in rate limit reached on key (${apiKey.substring(0, 8)}...). Register your free personal key at data.gov.in and add AGMARKNET_API_KEY in backend/.env for unlimited live calls.`);
      } else {
        console.warn(`[agmarknet] HTTP ${response.status} from data.gov.in`);
      }
      return [];
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.records) || data.records.length === 0) {
      return [];
    }

    const standardized = data.records.map((r) => ({
      crop_type: r.commodity || crop || 'General',
      market_name: r.market || 'APMC Mandi',
      state: r.state || state || 'India',
      min_price: parseFloat(r.min_price) || 0,
      max_price: parseFloat(r.max_price) || 0,
      modal_price: parseFloat(r.modal_price) || 0,
      price_date: parseArrivalDate(r.arrival_date),
      source: 'real',
    }));

    return standardized;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[agmarknet] Network or fetch error: ${err.message}`);
    return [];
  }
};

/**
 * Cache fetched prices in Supabase mandi_prices table and memory
 */
const cachePricesInDatabase = async (prices) => {
  if (!prices || prices.length === 0) return;
  try {
    for (const p of prices) {
      const cacheKey = `${p.crop_type}_${p.market_name}_${p.price_date}`;
      memoryCache.set(cacheKey, p);
    }

    // Try persisting to Supabase if accessible
    await supabase.from('mandi_prices').insert(prices).select();
  } catch (err) {
    console.debug(`[agmarknet cache] DB cache notice: ${err.message}`);
  }
};

/**
 * Filter mock fallback data by crop and state
 */
const getMockFallbackPrices = ({ crop, state, market }) => {
  let fallback = [...MOCK_MANDI_PRICES];

  if (crop && crop !== 'All Crops') {
    const cropLower = crop.toLowerCase().trim();
    fallback = fallback.filter((p) => p.crop_type.toLowerCase().includes(cropLower));
  }

  if (state && state !== 'All States') {
    const stateLower = state.toLowerCase().trim();
    fallback = fallback.filter((p) => p.state.toLowerCase().includes(stateLower));
  }

  if (market) {
    const marketLower = market.toLowerCase().trim();
    fallback = fallback.filter((p) => p.market_name.toLowerCase().includes(marketLower));
  }

  if (fallback.length === 0 && crop) {
    const cropLower = crop.toLowerCase().trim();
    const cropMatches = MOCK_MANDI_PRICES.filter((p) => p.crop_type.toLowerCase().includes(cropLower));
    if (cropMatches.length > 0) {
      fallback = cropMatches;
    } else {
      const today = new Date().toISOString().split('T')[0];
      fallback = [
        {
          crop_type: crop,
          market_name: 'Regional APMC Mandi',
          state: state || 'Maharashtra',
          min_price: 2200,
          max_price: 2600,
          modal_price: 2400,
          price_date: today,
          source: 'mock',
        },
      ];
    }
  }

  return fallback.map((item) => ({ ...item, source: 'mock' }));
};

/**
 * Primary Price Retrieval Service
 * Tries Real AGMARKNET API -> Then Memory Cache -> Then Supabase DB -> Then Labeled Mock Fallback
 */
const getMandiPrices = async ({ crop, state, limit = 50 }) => {
  // 1. Try real government API
  try {
    const liveRecords = await fetchFromGovernmentApi({ crop, state, limit });
    if (liveRecords.length > 0) {
      cachePricesInDatabase(liveRecords).catch(() => {});
      return liveRecords;
    }
  } catch (err) {
    console.warn(`[agmarknet] API retrieval failure: ${err.message}`);
  }

  // 2. Try Memory Cache
  if (memoryCache.size > 0) {
    let cached = Array.from(memoryCache.values());
    if (crop && crop !== 'All Crops') {
      const cropLower = crop.toLowerCase().trim();
      cached = cached.filter((c) => c.crop_type.toLowerCase().includes(cropLower));
    }
    if (state && state !== 'All States') {
      const stateLower = state.toLowerCase().trim();
      cached = cached.filter((c) => c.state.toLowerCase().includes(stateLower));
    }
    if (cached.length > 0) {
      return cached.slice(0, limit);
    }
  }

  // 3. Try Supabase mandi_prices table
  try {
    let dbQuery = supabase.from('mandi_prices').select('*').order('price_date', { ascending: false }).limit(limit);
    if (crop && crop !== 'All Crops') {
      dbQuery = dbQuery.ilike('crop_type', `%${crop}%`);
    }
    if (state && state !== 'All States') {
      dbQuery = dbQuery.ilike('state', `%${state}%`);
    }

    const { data: dbData, error } = await dbQuery;
    if (!error && Array.isArray(dbData) && dbData.length > 0) {
      return dbData.map((d) => ({
        crop_type: d.crop_type,
        market_name: d.market_name,
        state: d.state,
        min_price: parseFloat(d.min_price),
        max_price: parseFloat(d.max_price),
        modal_price: parseFloat(d.modal_price),
        price_date: d.price_date,
        source: d.source || 'mock',
      }));
    }
  } catch (err) {
    console.debug(`[agmarknet] Database query notice: ${err.message}`);
  }
  // 4. Guaranteed Mock Fallback (always labeled source: 'mock')
  return getMockFallbackPrices({ crop, state });
};

/**
 * Retrieve Chronological Price Trend for a crop & market
 */
const getPriceTrend = async ({ crop, market }) => {
  if (!crop) crop = 'Tomato';

  let trendRecords = [];

  // Try DB first
  try {
    let query = supabase
      .from('mandi_prices')
      .select('price_date, modal_price, source, crop_type, market_name')
      .ilike('crop_type', `%${crop}%`)
      .order('price_date', { ascending: true })
      .limit(30);

    if (market) {
      query = query.ilike('market_name', `%${market}%`);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      trendRecords = data.map((d) => ({
        price_date: d.price_date,
        modal_price: parseFloat(d.modal_price),
        source: d.source || 'mock',
      }));
    }
  } catch (err) {
    console.debug(`[agmarknet trend] DB error: ${err.message}`);
  }

  if (trendRecords.length < 2) {
    const mockMatches = getMockFallbackPrices({ crop, market });
    mockMatches.sort((a, b) => new Date(a.price_date) - new Date(b.price_date));
    trendRecords = mockMatches.map((m) => ({
      price_date: m.price_date,
      modal_price: m.modal_price,
      source: 'mock',
    }));
  }

  return trendRecords;
};

/**
 * Arbitrage Opportunity Finder across Mandis
 * Finds highest paying mandi vs lowest/average mandi for maximum farmer realization
 */
const getArbitrageOpportunities = async ({ crop }) => {
  if (!crop) crop = 'Tomato';
  const prices = await getMandiPrices({ crop, limit: 50 });

  if (prices.length === 0) return { best_mandi: null, spread: 0, mandis: [] };

  // Sort mandis by modal price descending
  const sorted = [...prices].sort((a, b) => b.modal_price - a.modal_price);
  const bestMandi = sorted[0];
  const lowestMandi = sorted[sorted.length - 1];
  const avgModal = Math.round(sorted.reduce((acc, p) => acc + p.modal_price, 0) / sorted.length);
  const spreadPerQuintal = bestMandi.modal_price - lowestMandi.modal_price;

  return {
    crop_type: crop,
    best_mandi: {
      market_name: bestMandi.market_name,
      state: bestMandi.state,
      modal_price: bestMandi.modal_price,
      source: bestMandi.source,
    },
    lowest_mandi: {
      market_name: lowestMandi.market_name,
      state: lowestMandi.state,
      modal_price: lowestMandi.modal_price,
    },
    average_modal_price: avgModal,
    arbitrage_spread_per_qtl: spreadPerQuintal,
    profit_potential_on_10qtl: spreadPerQuintal * 10,
    top_mandis: sorted.slice(0, 6),
  };
};

module.exports = {
  fetchFromGovernmentApi,
  cachePricesInDatabase,
  getMandiPrices,
  getPriceTrend,
  getMockFallbackPrices,
  getArbitrageOpportunities,
  parseArrivalDate,
};
