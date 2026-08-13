import { connect } from '@tidbcloud/serverless';

// TiDB Cloud CA Certificate (ISRG Root X1)
export const TIDB_CA_CERT = `-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRmOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----`;

// Retrieve TiDB credentials from Local Storage, Environment, or Default
export const getTiDBConnectionConfig = () => {
  let localConfig = {};
  try {
    const saved = localStorage.getItem('tidb_config');
    if (saved) localConfig = JSON.parse(saved);
  } catch (e) {}

  return {
    host: localConfig.host || import.meta.env.VITE_TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    username: localConfig.username || import.meta.env.VITE_TIDB_USERNAME || '',
    password: localConfig.password || import.meta.env.VITE_TIDB_PASSWORD || '',
    database: localConfig.database || import.meta.env.VITE_TIDB_DATABASE || 'taxi',
    ssl: {
      minVersion: 'TLSv1.2',
      ca: TIDB_CA_CERT
    }
  };
};

/**
 * Initialize TiDB Database Tables automatically
 */
export const initTiDBTables = async (customConfig) => {
  const config = customConfig || getTiDBConnectionConfig();
  if (!config.username || !config.password) return { success: false, error: 'Missing Username or Password' };
  try {
    const conn = connect(config);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(64) PRIMARY KEY,
        customerName VARCHAR(255),
        customerPhone VARCHAR(64),
        customerEmail VARCHAR(255),
        pickup TEXT,
        dropoff TEXT,
        vehicle VARCHAR(100),
        fare DECIMAL(10,2),
        tripType VARCHAR(100),
        scheduledDate VARCHAR(100),
        scheduledTime VARCHAR(100),
        driver VARCHAR(255) DEFAULT 'Unassigned',
        status VARCHAR(64) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(64),
        email VARCHAR(255),
        profession VARCHAR(100),
        area VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
};

/**
 * Save an inquiry to TiDB Cloud SQL database
 */
export const saveInquiryToTiDB = async (inquiry) => {
  const config = getTiDBConnectionConfig();
  if (!config.username || !config.password) return null;
  try {
    const conn = connect(config);
    const sql = `
      INSERT INTO inquiries (id, customerName, customerPhone, customerEmail, pickup, dropoff, vehicle, fare, tripType, scheduledDate, scheduledTime, driver, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE status=VALUES(status), driver=VALUES(driver);
    `;
    const params = [
      inquiry.id || `INQ-${Date.now()}`,
      inquiry.customerName || 'Customer',
      inquiry.customerPhone || '',
      inquiry.customerEmail || '',
      inquiry.pickup || '',
      inquiry.dropoff || '',
      inquiry.vehicle || 'Standard',
      Number(inquiry.fare || 0),
      inquiry.tripType || 'One-Way',
      inquiry.scheduledDate || 'Today',
      inquiry.scheduledTime || '',
      inquiry.driver || 'Unassigned',
      inquiry.status || 'Pending'
    ];
    await conn.execute(sql, params);
    return true;
  } catch (e) {
    console.warn('TiDB saveInquiry error:', e);
    return null;
  }
};

/**
 * Load all inquiries from TiDB Cloud SQL database
 */
export const loadAllInquiriesFromTiDB = async () => {
  const config = getTiDBConnectionConfig();
  if (!config.username || !config.password) return [];
  try {
    const conn = connect(config);
    const results = await conn.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
    return Array.isArray(results) ? results : [];
  } catch (e) {
    console.warn('TiDB loadAllInquiries error:', e);
    return [];
  }
};
