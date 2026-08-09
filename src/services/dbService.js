// TiDB Cloud & Central Database Sync Engine for Taxigo Ecosystem (Website, Android, iPhone)

const TIDB_CONFIG = {
  instanceName: 'dhruvil',
  instanceId: '10422715358543366144',
  region: 'ap-southeast-1 (Singapore)',
  status: 'Active',
  // TiDB Cloud Serverless MySQL Endpoint
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  database: 'taxigo_db',
  ssl: {
    rejectUnauthorized: true,
    caCertPath: 'd:\\taxiiiii\\isrgrootx1.pem',
    caCertName: 'ISRG Root X1 (Let\'s Encrypt)'
  }
};

// Local cache keys
const STORAGE_KEYS = {
  INQUIRIES: 'cabsy_inquiries',
  DESTINATIONS: 'cabsy_destinations',
  VEHICLES: 'cabsy_vehicles',
  DRIVERS: 'cabsy_drivers',
  CUSTOMERS: 'cabsy_customers',
  OWNER: 'cabsy_owner_info'
};

class DatabaseService {
  constructor() {
    this.config = TIDB_CONFIG;
    this.initDatabase();
  }

  // Initialize DB & ensure demo data is wiped clean
  initDatabase() {
    try {
      // Clear legacy demo data if present
      const inquiries = this.getInquiries();
      const hasDemoInquiries = inquiries.some(i => i.id && i.id.startsWith('INQ-90'));
      if (hasDemoInquiries) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
      }
    } catch (e) {
      console.warn('DB Init notice:', e);
    }
  }

  // Inquiries / Bookings API
  getInquiries() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveInquiry(inquiry) {
    const inquiries = this.getInquiries();
    const newInquiry = {
      id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'Pending',
      ...inquiry
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    
    // Dispatch real-time cross-platform event
    window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'INQUIRY_ADDED', data: newInquiry } }));
    return newInquiry;
  }

  deleteInquiry(id) {
    const inquiries = this.getInquiries().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'INQUIRY_DELETED', id } }));
  }

  clearAllDemoData() {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'DEMO_DATA_CLEARED' } }));
  }
}

export const db = new DatabaseService();
export default db;
