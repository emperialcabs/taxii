// Hostinger Remote MySQL Database Service Engine for Empire Cab Ecosystem
// Host: srv1671.hstgr.io | Database: u889282535_taxi | User: u889282535_taxi

const getApiEndpoint = () => {
  if (typeof window !== 'undefined' && (window.location.protocol === 'file:' || window.Capacitor)) {
    return 'https://cabsy-taxi-website.vercel.app/api/db';
  }
  return '/api/db';
};

const sendRequest = async (action, data = {}) => {
  try {
    const endpoint = getApiEndpoint();
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, data })
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Hostinger MySQL [${action}] failed:`, err.message || err);
    return { success: false, error: err.message || String(err) };
  }
};

/**
 * Initialize Hostinger MySQL Database Tables & Schema
 */
export const initMySQLTables = async () => {
  return await sendRequest('init');
};

/**
 * Save an inquiry to Hostinger MySQL database
 */
export const saveInquiryToMySQL = async (inquiry) => {
  if (!inquiry) return null;
  const res = await sendRequest('saveInquiry', inquiry);
  return res.success;
};

/**
 * Load all inquiries from Hostinger MySQL database
 */
export const loadAllInquiriesFromMySQL = async () => {
  const res = await sendRequest('getInquiries');
  return res.success && Array.isArray(res.inquiries) ? res.inquiries : [];
};

/**
 * Save customer profile to Hostinger MySQL database
 */
export const saveCustomerToMySQL = async (customer) => {
  if (!customer || (!customer.name && !customer.phone && !customer.email)) return null;
  const res = await sendRequest('saveCustomer', customer);
  return res.success;
};

/**
 * Load all customers from Hostinger MySQL database
 */
export const loadAllCustomersFromMySQL = async () => {
  const res = await sendRequest('getCustomers');
  return res.success && Array.isArray(res.customers) ? res.customers : [];
};

/**
 * Update inquiry status in Hostinger MySQL database
 */
export const updateInquiryStatusInMySQL = async (inquiryId, status, driverName) => {
  if (!inquiryId) return false;
  const res = await sendRequest('updateInquiryStatus', {
    id: inquiryId,
    status,
    driver: driverName
  });
  return res.success;
};

/**
 * Delete inquiry from Hostinger MySQL database
 */
export const deleteInquiryFromMySQL = async (inquiryId) => {
  if (!inquiryId) return false;
  const res = await sendRequest('deleteInquiry', { id: inquiryId });
  return res.success;
};

/**
 * Purge demo data from Hostinger MySQL database
 */
export const purgeDemoDataFromMySQL = async () => {
  const res = await sendRequest('purgeDemoData');
  return res.success;
};
