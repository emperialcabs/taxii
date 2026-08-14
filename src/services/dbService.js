// TiDB Cloud & Central Database Sync Engine for Empire Cab Ecosystem (Website, Android, iPhone)

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

  // Initialize DB — no demo data, Firestore is the source of truth
  initDatabase() {
    // Nothing to pre-seed; Admin Portal loads from Firestore on mount.
    // localStorage is only used as a temporary write buffer for the mobile app.
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
    
    // Auto sync customer in central database
    if (newInquiry.customerName || newInquiry.customerPhone) {
      this.saveCustomer({
        name: newInquiry.customerName,
        phone: newInquiry.customerPhone,
        email: newInquiry.customerEmail
      });
    }

    // Dispatch real-time cross-platform event
    window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'INQUIRY_ADDED', data: newInquiry } }));
    return newInquiry;
  }

  deleteInquiry(id) {
    const inquiries = this.getInquiries().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'INQUIRY_DELETED', id } }));
  }

  // Customers API
  getCustomers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCustomer(customerProfile) {
    if (!customerProfile || (!customerProfile.name && !customerProfile.phone && !customerProfile.email)) return null;
    
    const customers = this.getCustomers();
    const phoneKey = customerProfile.phone ? String(customerProfile.phone).replace(/\D/g, '') : '';
    const emailKey = customerProfile.email ? String(customerProfile.email).toLowerCase().trim() : '';

    const existingIdx = customers.findIndex(c => {
      const cPhone = c.phone ? String(c.phone).replace(/\D/g, '') : '';
      const cEmail = c.email ? String(c.email).toLowerCase().trim() : '';
      return (phoneKey && cPhone && phoneKey === cPhone) || (emailKey && cEmail && emailKey === cEmail);
    });

    const inquiries = this.getInquiries();
    const customerInquiries = inquiries.filter(i => {
      const iPhone = i.customerPhone ? String(i.customerPhone).replace(/\D/g, '') : '';
      const iEmail = i.customerEmail ? String(i.customerEmail).toLowerCase().trim() : '';
      return (phoneKey && iPhone && phoneKey === iPhone) || (emailKey && iEmail && emailKey === iEmail);
    });

    const totalRides = customerInquiries.length;
    const totalSpent = customerInquiries.reduce((sum, i) => sum + (parseFloat(i.fare) || 0), 0);

    const updatedCustomer = {
      id: existingIdx >= 0 ? customers[existingIdx].id : 'CUST-' + Math.floor(10000 + Math.random() * 90000),
      name: customerProfile.name || 'Rider',
      email: customerProfile.email || 'user@empirecab.in',
      phone: customerProfile.phone || '+91 98765 43210',
      photoURL: customerProfile.photoURL || null,
      registeredAt: existingIdx >= 0 ? customers[existingIdx].registeredAt : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalRides,
      totalSpent: `₹${totalSpent.toLocaleString('en-IN')}`,
      totalSpentNum: totalSpent,
      status: 'Active',
      lastLogin: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      customers[existingIdx] = { ...customers[existingIdx], ...updatedCustomer };
    } else {
      customers.unshift(updatedCustomer);
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    
    // Auto-sync customer profile to TiDB Cloud SQL Database
    import('./tidbService.js').then(m => {
      if (m.saveCustomerToTiDB) {
        m.saveCustomerToTiDB(updatedCustomer).catch(() => {});
      }
    }).catch(() => {});

    window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'CUSTOMER_UPDATED', data: updatedCustomer } }));
    return updatedCustomer;
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
