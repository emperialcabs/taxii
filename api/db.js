import mysql from 'mysql2/promise';

// Hostinger Remote MySQL Database Connection Pool Configuration
const poolConfig = {
  host: process.env.MYSQL_HOST || 'srv1671.hstgr.io',
  user: process.env.MYSQL_USER || 'u889282535_taxi',
  password: process.env.MYSQL_PASSWORD || 'Mahadev909099',
  database: process.env.MYSQL_DATABASE || 'u889282535_taxi',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

let pool = mysql.createPool(poolConfig);

async function executeQuery(sql, params = []) {
  try {
    return await pool.query(sql, params);
  } catch (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
      console.warn('MySQL connection lost. Re-creating pool...', err.code);
      pool = mysql.createPool(poolConfig);
      return await pool.query(sql, params);
    }
    throw err;
  }
}

// Table Schema Initializer
async function ensureTablesExist() {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id VARCHAR(64) PRIMARY KEY,
      customerName VARCHAR(255),
      customerPhone VARCHAR(64),
      customerEmail VARCHAR(255),
      pickup TEXT,
      dropoff TEXT,
      vehicle VARCHAR(100),
      fare DECIMAL(10,2) DEFAULT 0.00,
      tripType VARCHAR(100),
      scheduledDate VARCHAR(100),
      scheduledTime VARCHAR(100),
      driver VARCHAR(255) DEFAULT 'Unassigned',
      status VARCHAR(64) DEFAULT 'Pending',
      timestamp VARCHAR(100),
      date VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await executeQuery(`
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(64),
      email VARCHAR(255),
      photoURL TEXT,
      profession VARCHAR(100),
      area VARCHAR(255),
      totalRides INT DEFAULT 0,
      totalSpent DECIMAL(10,2) DEFAULT 0.00,
      registeredAt VARCHAR(64),
      lastLogin VARCHAR(100),
      status VARCHAR(64) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
}

export async function handleMySQLRequest(action, data = {}) {
  try {
    await ensureTablesExist();

    switch (action) {
      case 'init': {
        return { success: true, message: 'Hostinger MySQL database initialized successfully.' };
      }

      case 'getInquiries': {
        const [rows] = await executeQuery('SELECT * FROM inquiries ORDER BY created_at DESC');
        return { success: true, inquiries: rows };
      }

      case 'saveInquiry': {
        const { id, customerName, customerPhone, customerEmail, pickup, dropoff, vehicle, fare, tripType, scheduledDate, scheduledTime, driver, status, timestamp, date } = data;
        const sql = `
          INSERT INTO inquiries (id, customerName, customerPhone, customerEmail, pickup, dropoff, vehicle, fare, tripType, scheduledDate, scheduledTime, driver, status, timestamp, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            customerName = VALUES(customerName),
            customerPhone = VALUES(customerPhone),
            customerEmail = VALUES(customerEmail),
            pickup = VALUES(pickup),
            dropoff = VALUES(dropoff),
            vehicle = VALUES(vehicle),
            fare = VALUES(fare),
            tripType = VALUES(tripType),
            scheduledDate = VALUES(scheduledDate),
            scheduledTime = VALUES(scheduledTime),
            driver = VALUES(driver),
            status = VALUES(status),
            timestamp = VALUES(timestamp),
            date = VALUES(date);
        `;
        const inqId = id || `INQ-${Date.now()}`;
        const params = [
          inqId,
          customerName || 'Customer',
          customerPhone || '',
          customerEmail || '',
          pickup || '',
          dropoff || '',
          vehicle || 'Standard',
          Number(fare || 0),
          tripType || 'One-Way',
          scheduledDate || 'Today',
          scheduledTime || '',
          driver || 'Unassigned',
          status || 'Pending',
          timestamp || new Date().toISOString(),
          date || new Date().toLocaleDateString('en-US')
        ];
        await executeQuery(sql, params);

        // Auto-register/update customer record whenever an inquiry is submitted
        if (customerName) {
          const custEmail = customerEmail || (customerName.toLowerCase().replace(/\s+/g, '.') + '@empirecab.in');
          const custId = `CUST-${(customerPhone || custEmail).replace(/[^a-z0-9]/gi, '_')}`;
          const custSql = `
            INSERT INTO customers (id, name, phone, email, totalRides, totalSpent, registeredAt, lastLogin, status)
            VALUES (?, ?, ?, ?, 1, ?, ?, ?, 'Active')
            ON DUPLICATE KEY UPDATE
              name = VALUES(name),
              phone = IF(VALUES(phone) != '', VALUES(phone), phone),
              email = IF(VALUES(email) != '', VALUES(email), email),
              totalRides = totalRides + 1,
              totalSpent = totalSpent + VALUES(totalSpent),
              lastLogin = VALUES(lastLogin);
          `;
          await executeQuery(custSql, [
            custId,
            customerName,
            customerPhone || '',
            custEmail,
            Number(fare || 0),
            new Date().toLocaleDateString('en-US'),
            new Date().toISOString()
          ]).catch(() => {});
        }

        return { success: true, id: inqId };
      }

      case 'updateInquiryStatus': {
        const { id, status, driver } = data;
        if (!id) return { success: false, error: 'Missing inquiry ID' };
        if (driver) {
          await executeQuery('UPDATE inquiries SET status = ?, driver = ? WHERE id = ?', [status, driver, id]);
        } else {
          await executeQuery('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
        }
        return { success: true };
      }

      case 'deleteInquiry': {
        const { id } = data;
        if (!id) return { success: false, error: 'Missing inquiry ID' };
        await executeQuery('DELETE FROM inquiries WHERE id = ?', [id]);
        return { success: true };
      }

      case 'getCustomers': {
        const [rows] = await executeQuery('SELECT * FROM customers ORDER BY created_at DESC');
        return { success: true, customers: rows };
      }

      case 'saveCustomer': {
        const { id, name, phone, email, photoURL, profession, area, totalRides, totalSpent, registeredAt, lastLogin, status } = data;
        if (!name && !phone && !email) return { success: false, error: 'Empty customer profile' };
        
        const custId = id || (email ? `CUST-${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : (phone ? `CUST-${phone.replace(/\D/g, '')}` : `CUST-${Math.floor(10000 + Math.random() * 89999)}`));
        const sql = `
          INSERT INTO customers (id, name, phone, email, photoURL, profession, area, totalRides, totalSpent, registeredAt, lastLogin, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            phone = IF(VALUES(phone) != '', VALUES(phone), phone),
            email = IF(VALUES(email) != '', VALUES(email), email),
            photoURL = IF(VALUES(photoURL) IS NOT NULL, VALUES(photoURL), photoURL),
            profession = VALUES(profession),
            area = VALUES(area),
            registeredAt = VALUES(registeredAt),
            lastLogin = VALUES(lastLogin),
            status = VALUES(status);
        `;
        const params = [
          custId,
          name || 'Rider',
          phone || '',
          email || '',
          photoURL || null,
          profession || 'Rider',
          area || 'Gujarat, India',
          Number(totalRides || 0),
          Number(totalSpent || 0),
          registeredAt || new Date().toISOString().split('T')[0],
          lastLogin || new Date().toISOString(),
          status || 'Active'
        ];
        await executeQuery(sql, params);
        return { success: true, id: custId };
      }

      case 'deleteCustomer': {
        const { id } = data;
        if (!id) return { success: false, error: 'Missing customer ID' };
        await executeQuery('DELETE FROM customers WHERE id = ? OR email = ? OR phone = ?', [id, id, id]);
        return { success: true };
      }

      case 'purgeDemoData': {
        await executeQuery("DELETE FROM customers WHERE email LIKE '%@customer.com' OR email LIKE '%@client.com' OR email LIKE '%test%' OR name IN ('Ankit Mehta', 'Bhavin Patel', 'Website Guest', 'John Doe', 'Test Google Rider');");
        await executeQuery("DELETE FROM inquiries WHERE customerName IN ('Ankit Mehta', 'Bhavin Patel', 'Website Guest', 'John Doe', 'Test Google Rider') OR customerEmail LIKE '%@customer.com' OR customerEmail LIKE '%test%';");
        return { success: true };
      }

      case 'purgeAllData': {
        await executeQuery('TRUNCATE TABLE inquiries;');
        await executeQuery('TRUNCATE TABLE customers;');
        return { success: true };
      }

      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  } catch (err) {
    console.error('Hostinger MySQL Error:', err);
    return { success: false, error: err.message || String(err) };
  }
}

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const query = req.query || {};
    const action = body.action || query.action || 'init';
    const data = body.data || body;

    const result = await handleMySQLRequest(action, data);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || String(error) });
  }
}
