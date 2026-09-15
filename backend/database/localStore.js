const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('crypto');

const STORE_PATH = path.join(__dirname, 'agrisync_store.json');

const defaultData = {
  users: [
    {
      id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
      name: 'Aayush Farmer',
      email: 'operator@intrusion.com',
      created_at: new Date().toISOString(),
    },
  ],
  farms: [
    {
      id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
      user_id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
      name: 'AgriSync Main Farm',
      location: 'North Sector Field',
      created_at: new Date().toISOString(),
    },
  ],
  cameras: [
    {
      id: 'cam_01',
      farm_id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
      name: 'North Perimeter Cam',
      zone: 'North Field',
      status: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cam_02',
      farm_id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
      name: 'East Barn Camera',
      zone: 'East Barn',
      status: true,
      created_at: new Date().toISOString(),
    },
  ],
  detections: [
    {
      id: 'det-001',
      camera_id: 'cam_01',
      animal: 'cow',
      confidence: 88,
      image_url: '',
      detected_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'det-002',
      camera_id: 'cam_02',
      animal: 'pig',
      confidence: 91,
      image_url: '',
      detected_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
  ],
  crop_loss_incidents: [
    {
      id: 'inc-001',
      farm_id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
      detection_id: 'det-001',
      crop_type: 'Wheat',
      affected_area_estimate: '0.4 acres',
      notes: 'Wheat damage along north boundary fence.',
      reported_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      confirmed_by_farmer: true,
    },
    {
      id: 'inc-002',
      farm_id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
      detection_id: 'det-002',
      crop_type: 'Corn',
      affected_area_estimate: '15%',
      notes: 'Wild boar entry near east barn corner.',
      reported_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      confirmed_by_farmer: true,
    },
  ],
};

function loadStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      saveStore(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[localStore notice] Could not parse local store (${err.message}). Resetting to default data.`);
    saveStore(defaultData);
    return defaultData;
  }
}

function saveStore(data) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`[localStore error] Failed to write local store: ${err.message}`);
  }
}

function generateUuid() {
  if (typeof uuidv4 === 'function') {
    try {
      return uuidv4();
    } catch {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const localStore = {
  getCollection(table) {
    const store = loadStore();
    return store[table] || [];
  },

  insert(table, row) {
    const store = loadStore();
    if (!store[table]) store[table] = [];
    const newRow = {
      id: row.id || generateUuid(),
      ...row,
    };
    store[table].unshift(newRow);
    saveStore(store);
    return newRow;
  },

  find(table, filterFn) {
    const items = this.getCollection(table);
    return filterFn ? items.filter(filterFn) : items;
  },
};

module.exports = localStore;
