// Hostinger Remote MySQL Central Database Sync Engine for Empire Cab Ecosystem (Website, Android, iPhone)
// Host: srv1671.hstgr.io | DB: u889282535_taxi

import {
  saveInquiryToMySQL,
  saveCustomerToMySQL,
  loadAllInquiriesFromMySQL,
  loadAllCustomersFromMySQL
} from './mysqlService';

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
    this.initDatabase();
  }

  initDatabase() {
    // Background sync from Hostinger MySQL
    this.syncFromCloud();
  }

  async syncFromCloud() {
    try {
      const [cloudInquiries, cloudCustomers] = await Promise.all([
        loadAllInquiriesFromMySQL().catch(() => []),
        loadAllCustomersFromMySQL().catch(() => [])
      ]);

      if (Array.isArray(cloudInquiries) && cloudInquiries.length > 0) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(cloudInquiries));
      }
      if (Array.isArray(cloudCustomers) && cloudCustomers.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(cloudCustomers));
      }
    } catch (e) {
      console.warn('MySQL cloud sync warning:', e);
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
    const existingIdx = inquiries.findIndex(i => i.id && inquiry.id && i.id === inquiry.id);
    const newInquiry = {
      id: inquiry.id || ('INQ-' + Math.floor(1000 + Math.random() * 9000)),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'Pending',
      ...inquiry
    };
    if (existingIdx >= 0) {
      inquiries[existingIdx] = newInquiry;
    } else {
      inquiries.unshift(newInquiry);
    }
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    
    // Auto sync customer in Hostinger MySQL central database
    if (newInquiry.customerName || newInquiry.customerPhone) {
      this.saveCustomer({
        name: newInquiry.customerName,
        phone: newInquiry.customerPhone,
        email: newInquiry.customerEmail
      });
    }

    // Auto sync inquiry to Hostinger MySQL Database
    saveInquiryToMySQL(newInquiry).catch(() => {});

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
    
    // Auto-sync customer profile to Hostinger MySQL Database
    saveCustomerToMySQL(updatedCustomer).catch(() => {});

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
