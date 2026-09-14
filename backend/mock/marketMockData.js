/**
 * AgriSync - Centralized Market, Buyer, and Logistics Mock Data
 * Tagged strictly as source: 'mock' for transparency and demo reliability.
 */

const getPastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const MOCK_MANDI_PRICES = [
  // Tomato - Somala APMC, Andhra Pradesh (Rising Trend: ~1000 to ~1350)
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 900, max_price: 1100, modal_price: 1000, price_date: getPastDate(14), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 950, max_price: 1150, modal_price: 1050, price_date: getPastDate(12), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 1000, max_price: 1200, modal_price: 1100, price_date: getPastDate(10), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 1050, max_price: 1250, modal_price: 1150, price_date: getPastDate(8), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 1100, max_price: 1300, modal_price: 1200, price_date: getPastDate(6), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 1150, max_price: 1350, modal_price: 1250, price_date: getPastDate(4), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 1200, max_price: 1400, modal_price: 1300, price_date: getPastDate(2), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Somala APMC', state: 'Andhra Pradesh', min_price: 1250, max_price: 1450, modal_price: 1350, price_date: getPastDate(0), source: 'mock' },

  // Tomato - Ganaur APMC, Haryana
  { crop_type: 'Tomato', market_name: 'Ganaur APMC', state: 'Haryana', min_price: 2400, max_price: 2900, modal_price: 2700, price_date: getPastDate(7), source: 'mock' },
  { crop_type: 'Tomato', market_name: 'Ganaur APMC', state: 'Haryana', min_price: 2500, max_price: 3000, modal_price: 2800, price_date: getPastDate(0), source: 'mock' },

  // Wheat - Indore APMC, Madhya Pradesh (Steady upward trend)
  { crop_type: 'Wheat', market_name: 'Indore APMC', state: 'Madhya Pradesh', min_price: 2350, max_price: 2550, modal_price: 2450, price_date: getPastDate(14), source: 'mock' },
  { crop_type: 'Wheat', market_name: 'Indore APMC', state: 'Madhya Pradesh', min_price: 2380, max_price: 2580, modal_price: 2480, price_date: getPastDate(10), source: 'mock' },
  { crop_type: 'Wheat', market_name: 'Indore APMC', state: 'Madhya Pradesh', min_price: 2400, max_price: 2600, modal_price: 2500, price_date: getPastDate(7), source: 'mock' },
  { crop_type: 'Wheat', market_name: 'Indore APMC', state: 'Madhya Pradesh', min_price: 2420, max_price: 2620, modal_price: 2520, price_date: getPastDate(3), source: 'mock' },
  { crop_type: 'Wheat', market_name: 'Indore APMC', state: 'Madhya Pradesh', min_price: 2450, max_price: 2650, modal_price: 2550, price_date: getPastDate(0), source: 'mock' },

  // Onion - Lasalgaon APMC, Maharashtra (Falling Trend)
  { crop_type: 'Onion', market_name: 'Lasalgaon APMC', state: 'Maharashtra', min_price: 2200, max_price: 2600, modal_price: 2400, price_date: getPastDate(14), source: 'mock' },
  { crop_type: 'Onion', market_name: 'Lasalgaon APMC', state: 'Maharashtra', min_price: 2100, max_price: 2500, modal_price: 2300, price_date: getPastDate(10), source: 'mock' },
  { crop_type: 'Onion', market_name: 'Lasalgaon APMC', state: 'Maharashtra', min_price: 2000, max_price: 2400, modal_price: 2200, price_date: getPastDate(7), source: 'mock' },
  { crop_type: 'Onion', market_name: 'Lasalgaon APMC', state: 'Maharashtra', min_price: 1900, max_price: 2300, modal_price: 2100, price_date: getPastDate(4), source: 'mock' },
  { crop_type: 'Onion', market_name: 'Lasalgaon APMC', state: 'Maharashtra', min_price: 1800, max_price: 2200, modal_price: 2000, price_date: getPastDate(0), source: 'mock' },

  // Rice - Karnal APMC, Haryana
  { crop_type: 'Rice', market_name: 'Karnal APMC', state: 'Haryana', min_price: 3100, max_price: 3400, modal_price: 3250, price_date: getPastDate(14), source: 'mock' },
  { crop_type: 'Rice', market_name: 'Karnal APMC', state: 'Haryana', min_price: 3150, max_price: 3450, modal_price: 3300, price_date: getPastDate(7), source: 'mock' },
  { crop_type: 'Rice', market_name: 'Karnal APMC', state: 'Haryana', min_price: 3200, max_price: 3500, modal_price: 3350, price_date: getPastDate(0), source: 'mock' },

  // Potato - Agra APMC, Uttar Pradesh
  { crop_type: 'Potato', market_name: 'Agra APMC', state: 'Uttar Pradesh', min_price: 1400, max_price: 1700, modal_price: 1550, price_date: getPastDate(14), source: 'mock' },
  { crop_type: 'Potato', market_name: 'Agra APMC', state: 'Uttar Pradesh', min_price: 1450, max_price: 1750, modal_price: 1600, price_date: getPastDate(7), source: 'mock' },
  { crop_type: 'Potato', market_name: 'Agra APMC', state: 'Uttar Pradesh', min_price: 1500, max_price: 1800, modal_price: 1650, price_date: getPastDate(0), source: 'mock' },

  // Soybean - Ujjain APMC, Madhya Pradesh
  { crop_type: 'Soybean', market_name: 'Ujjain APMC', state: 'Madhya Pradesh', min_price: 4400, max_price: 4800, modal_price: 4600, price_date: getPastDate(14), source: 'mock' },
  { crop_type: 'Soybean', market_name: 'Ujjain APMC', state: 'Madhya Pradesh', min_price: 4500, max_price: 4900, modal_price: 4700, price_date: getPastDate(7), source: 'mock' },
  { crop_type: 'Soybean', market_name: 'Ujjain APMC', state: 'Madhya Pradesh', min_price: 4600, max_price: 5000, modal_price: 4800, price_date: getPastDate(0), source: 'mock' }
];

const MOCK_LOGISTICS_FACILITIES = [
  {
    id: 'f1010101-0000-0000-0000-000000000001',
    facility_name: 'Mahafresh Cold Chain Hub',
    type: 'cold_storage',
    location: 'Nashik APMC Corridor',
    state: 'Maharashtra',
    capacity_kg: 50000,
    cost_per_day: 350.00,
    contact_phone: '+91-9823011223',
    perishable_compatible: true,
    rating: 4.8
  },
  {
    id: 'f1010101-0000-0000-0000-000000000002',
    facility_name: 'Kisan Agri Mega Warehouse',
    type: 'warehouse',
    location: 'Sanwer Road, Indore',
    state: 'Madhya Pradesh',
    capacity_kg: 200000,
    cost_per_day: 180.00,
    contact_phone: '+91-9876543210',
    perishable_compatible: false,
    rating: 4.6
  },
  {
    id: 'f1010101-0000-0000-0000-000000000003',
    facility_name: 'Godavari Cold Storage Depot',
    type: 'cold_storage',
    location: 'Rajahmundry Bypass',
    state: 'Andhra Pradesh',
    capacity_kg: 35000,
    cost_per_day: 290.00,
    contact_phone: '+91-9440123456',
    perishable_compatible: true,
    rating: 4.7
  },
  {
    id: 'f1010101-0000-0000-0000-000000000004',
    facility_name: 'Gujarat Agri Logistic Park',
    type: 'warehouse',
    location: 'Sachin GIDC, Surat',
    state: 'Gujarat',
    capacity_kg: 120000,
    cost_per_day: 210.00,
    contact_phone: '+91-9825098765',
    perishable_compatible: false,
    rating: 4.5
  },
  {
    id: 'f1010101-0000-0000-0000-000000000005',
    facility_name: 'Punjab Silo Storage Terminal',
    type: 'warehouse',
    location: 'GT Road, Ludhiana',
    state: 'Punjab',
    capacity_kg: 300000,
    cost_per_day: 150.00,
    contact_phone: '+91-9814054321',
    perishable_compatible: false,
    rating: 4.9
  },
  {
    id: 'f1010101-0000-0000-0000-000000000006',
    facility_name: 'Bangalore Rural Cold Hub',
    type: 'cold_storage',
    location: 'Hoskote Industrial Area',
    state: 'Karnataka',
    capacity_kg: 40000,
    cost_per_day: 320.00,
    contact_phone: '+91-9845012398',
    perishable_compatible: true,
    rating: 4.7
  },
  {
    id: 'f1010101-0000-0000-0000-000000000007',
    facility_name: 'TransKisan Fleet Logistics',
    type: 'transport_provider',
    location: 'Azadpur Mandi Hub, Delhi',
    state: 'Delhi',
    capacity_kg: 15000,
    cost_per_day: 1200.00,
    contact_phone: '+91-9911223344',
    perishable_compatible: true,
    rating: 4.6
  }
];

const MOCK_BUYER_PROFILES = [
  {
    id: 'b1010101-0000-0000-0000-000000000001',
    buyer_name: 'Reliance Retail Fresh Sourcing',
    company_name: 'Reliance Retail Ltd',
    crop_type: 'Tomato',
    min_quantity_kg: 1000,
    preferred_grade: 'A',
    location: 'Nashik',
    state: 'Maharashtra',
    contact_phone: '+91-9822019988'
  },
  {
    id: 'b1010101-0000-0000-0000-000000000002',
    buyer_name: 'BigBasket Direct Farm Sourcing',
    company_name: 'Supermarket Grocery Supplies',
    crop_type: 'Tomato',
    min_quantity_kg: 500,
    preferred_grade: 'any',
    location: 'Kollam',
    state: 'Keralam',
    contact_phone: '+91-9844098877'
  },
  {
    id: 'b1010101-0000-0000-0000-000000000003',
    buyer_name: 'AgroCorp Grain Exporters',
    company_name: 'AgroCorp International',
    crop_type: 'Wheat',
    min_quantity_kg: 5000,
    preferred_grade: 'A',
    location: 'Indore',
    state: 'Madhya Pradesh',
    contact_phone: '+91-9877023311'
  },
  {
    id: 'b1010101-0000-0000-0000-000000000004',
    buyer_name: 'Kisan Mitra FPO Federation',
    company_name: 'Kisan Mitra Producer Co.',
    crop_type: 'Onion',
    min_quantity_kg: 2000,
    preferred_grade: 'B',
    location: 'Lasalgaon',
    state: 'Maharashtra',
    contact_phone: '+91-9823045566'
  },
  {
    id: 'b1010101-0000-0000-0000-000000000005',
    buyer_name: 'ITC Agri-Business Division',
    company_name: 'ITC Limited',
    crop_type: 'Soybean',
    min_quantity_kg: 3000,
    preferred_grade: 'A',
    location: 'Ujjain',
    state: 'Madhya Pradesh',
    contact_phone: '+91-9893012233'
  }
];

const MOCK_PRODUCE_LOTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    farm_id: 'farm-001',
    crop_type: 'Tomato',
    quantity_kg: 1200,
    grade: 'A',
    harvest_date: getPastDate(2),
    location: 'Somala',
    state: 'Andhra Pradesh',
    status: 'available'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    farm_id: 'farm-002',
    crop_type: 'Wheat',
    quantity_kg: 6000,
    grade: 'A',
    harvest_date: getPastDate(10),
    location: 'Indore',
    state: 'Madhya Pradesh',
    status: 'available'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    farm_id: 'farm-003',
    crop_type: 'Onion',
    quantity_kg: 2500,
    grade: 'B',
    harvest_date: getPastDate(5),
    location: 'Lasalgaon',
    state: 'Maharashtra',
    status: 'available'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    farm_id: 'farm-004',
    crop_type: 'Soybean',
    quantity_kg: 4000,
    grade: 'A',
    harvest_date: getPastDate(14),
    location: 'Ujjain',
    state: 'Madhya Pradesh',
    status: 'available'
  }
];

module.exports = {
  MOCK_MANDI_PRICES,
  MOCK_LOGISTICS_FACILITIES,
  MOCK_BUYER_PROFILES,
  MOCK_PRODUCE_LOTS,
  getPastDate
};
