/**
 * AgriSync - Comprehensive Test Suite for Market Intelligence, Buyer Matching & Logistics
 * Owner: Tej
 */

const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const errorHandler = require('../middleware/errorHandler');

const marketRoutes = require('../routes/market');
const buyerRoutes = require('../routes/buyers');
const logisticsRoutes = require('../routes/logistics');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', marketRoutes);
app.use('/api', buyerRoutes);
app.use('/api', logisticsRoutes);
app.use(errorHandler);

const PORT = 5055;
let server;

const request = async (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting AgriSync Market Intelligence Test Suite ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, extraInfo = '') => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${extraInfo}`);
      failed++;
    }
  };

  await new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 1. Mandi Prices Endpoint (Real AGMARKNET API or Cache)
    const resPrices = await request('GET', '/api/prices?crop=Tomato&state=Andhra%20Pradesh');
    assert(resPrices.status === 200, 'GET /api/prices returns 200', `Status: ${resPrices.status}`);
    assert(Array.isArray(resPrices.body) && resPrices.body.length > 0, 'GET /api/prices returns non-empty array');
    const firstPrice = resPrices.body[0] || {};
    assert(firstPrice.crop_type && firstPrice.modal_price && firstPrice.source, 'Price record has crop_type, modal_price, and source');
    assert(firstPrice.source === 'real' || firstPrice.source === 'mock', 'Price record source is strictly "real" or "mock"');

    // 2. Mandi Prices Fallback (Non-existent crop fallback to mock)
    const resFallback = await request('GET', '/api/prices?crop=DragonfruitXYZ');
    assert(resFallback.status === 200, 'GET /api/prices with missing crop returns 200');
    assert(Array.isArray(resFallback.body) && resFallback.body.length > 0, 'Fallback returns mock records for missing crop');
    assert(resFallback.body[0]?.source === 'mock', 'Missing crop fallback is clearly labeled source: "mock"');

    // 3. Price Trend Endpoint
    const resTrend = await request('GET', '/api/prices/trend?crop=Tomato&market=Somala%20APMC');
    assert(resTrend.status === 200, 'GET /api/prices/trend returns 200');
    assert(Array.isArray(resTrend.body) && resTrend.body.length >= 2, 'Price trend returns array of time-series records');
    const trendRecord = resTrend.body[0];
    assert(trendRecord.price_date && trendRecord.modal_price && trendRecord.source, 'Trend record matches schema: price_date, modal_price, source');

    // 4. Sale-Window Recommendation Endpoint
    const resSaleWindow = await request('GET', '/api/lots/11111111-1111-1111-1111-111111111111/sale-window');
    assert(resSaleWindow.status === 200, 'GET /api/lots/:id/sale-window returns 200');
    assert(resSaleWindow.body.lot_id === '11111111-1111-1111-1111-111111111111', 'Sale window returns correct lot_id');
    assert(['sell_now', 'hold'].includes(resSaleWindow.body.recommendation), 'Sale window recommendation is "sell_now" or "hold"');
    assert(typeof resSaleWindow.body.rationale === 'string' && resSaleWindow.body.rationale.length > 0, 'Sale window provides plain-language rationale');

    // 5. Buyer Profile Creation Endpoint
    const newBuyer = {
      buyer_name: 'GreenFarm Organic Hub',
      company_name: 'GreenFarm Enterprises',
      crop_type: 'Tomato',
      min_quantity_kg: 800,
      preferred_grade: 'A',
      location: 'Pune',
      state: 'Maharashtra',
      contact_phone: '+91-9890123456',
    };
    const resCreateBuyer = await request('POST', '/api/buyer-profile', newBuyer);
    assert(resCreateBuyer.status === 201, 'POST /api/buyer-profile returns 201 Created');
    assert(resCreateBuyer.body.id && resCreateBuyer.body.crop_type === 'Tomato', 'Created buyer profile contains id and crop_type');

    // 6. Produce Lot Matches for Farmer
    const resLotMatches = await request('GET', '/api/lots/11111111-1111-1111-1111-111111111111/matches');
    assert(resLotMatches.status === 200, 'GET /api/lots/:id/matches returns 200');
    assert(Array.isArray(resLotMatches.body), 'Lot matches returns an array');
    if (resLotMatches.body.length > 0) {
      const match = resLotMatches.body[0];
      assert(match.buyer_id && typeof match.match_score === 'number', 'Lot match contains buyer_id and numeric match_score');
      assert(match.status === 'suggested' || match.status === 'interested', 'Lot match status is valid');
    }

    // 7. Buyer Matches for Buyer
    const buyerId = resCreateBuyer.body.id || 'b1010101-0000-0000-0000-000000000001';
    const resBuyerMatches = await request('GET', `/api/buyers/${buyerId}/matches`);
    assert(resBuyerMatches.status === 200, 'GET /api/buyers/:id/matches returns 200');
    assert(Array.isArray(resBuyerMatches.body), 'Buyer matches returns an array');
    if (resBuyerMatches.body.length > 0) {
      assert(resBuyerMatches.body[0].lot_id && typeof resBuyerMatches.body[0].match_score === 'number', 'Buyer match has lot_id and match_score');
    }

    // 8. Update Match Status (PATCH)
    const matchId = `match_11111111-1111-1111-1111-111111111111_${buyerId}`;
    const resPatchMatch = await request('PATCH', `/api/matches/${matchId}`, { status: 'interested' });
    assert(resPatchMatch.status === 200, 'PATCH /api/matches/:id returns 200');
    assert(resPatchMatch.body.status === 'interested', 'Match status updated to "interested"');

    // 9. Logistics Recommendation
    const resLogistics = await request('GET', '/api/lots/11111111-1111-1111-1111-111111111111/logistics-suggestion');
    assert(resLogistics.status === 200, 'GET /api/lots/:id/logistics-suggestion returns 200');
    assert(resLogistics.body.recommended && resLogistics.body.recommended.facility_name, 'Logistics returns recommended facility');
    assert(Array.isArray(resLogistics.body.alternatives), 'Logistics returns alternatives array');
    assert(typeof resLogistics.body.recommended.reason === 'string', 'Recommended facility includes plain reason');

    // 10. Logistics Facilities List
    const resFacilities = await request('GET', '/api/logistics/facilities');
    assert(resFacilities.status === 200, 'GET /api/logistics/facilities returns 200');
    assert(Array.isArray(resFacilities.body) && resFacilities.body.length >= 5, 'Logistics facilities list returns seeded facilities');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n--- Test Results: ${passed} Passed, ${failed} Failed ---`);
    if (failed > 0) {
      process.exit(1);
    }
  }
};

runTests();
