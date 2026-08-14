import mysql from 'mysql2/promise';

// Hostinger Remote MySQL Database Connection Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'srv1671.hstgr.io',
  user: process.env.MYSQL_USER || 'u889282535_taxi',
  password: process.env.MYSQL_PASSWORD || 'Mahadev909099',
  database: process.env.MYSQL_DATABASE || 'u889282535_taxi',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

// Table Schema Initializer
async function ensureTablesExist() {
  await pool.query(`
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

  await pool.query(`
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
        const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
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
        const params = [
          id || `INQ-${Date.now()}`,
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
        await pool.query(sql, params);
        return { success: true, id: params[0] };
      }

      case 'updateInquiryStatus': {
        const { id, status, driver } = data;
        if (!id) return { success: false, error: 'Missing inquiry ID' };
        if (driver) {
          await pool.query('UPDATE inquiries SET status = ?, driver = ? WHERE id = ?', [status, driver, id]);
        } else {
          await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
        }
        return { success: true };
      }

      case 'deleteInquiry': {
        const { id } = data;
        if (!id) return { success: false, error: 'Missing inquiry ID' };
        await pool.query('DELETE FROM inquiries WHERE id = ?', [id]);
        return { success: true };
      }

      case 'getCustomers': {
        const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
        return { success: true, customers: rows };
      }

      case 'saveCustomer': {
        const { id, name, phone, email, photoURL, profession, area, totalRides, totalSpent, registeredAt, lastLogin, status } = data;
        if (!name && !phone && !email) return { success: false, error: 'Empty customer profile' };
        
        const custId = id || `CUST-${Math.floor(10000 + Math.random() * 89999)}`;
        const sql = `
          INSERT INTO customers (id, name, phone, email, photoURL, profession, area, totalRides, totalSpent, registeredAt, lastLogin, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            phone = VALUES(phone),
            email = VALUES(email),
            photoURL = VALUES(photoURL),
            profession = VALUES(profession),
            area = VALUES(area),
            totalRides = VALUES(totalRides),
            totalSpent = VALUES(totalSpent),
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
        await pool.query(sql, params);
        return { success: true, id: custId };
      }

      case 'purgeDemoData': {
        await pool.query("DELETE FROM customers WHERE email LIKE '%@customer.com' OR email LIKE '%@client.com' OR name IN ('Ankit Mehta', 'Bhavin Patel', 'Website Guest', 'John Doe');");
        await pool.query("DELETE FROM inquiries WHERE customerName IN ('Ankit Mehta', 'Bhavin Patel', 'Website Guest', 'John Doe') OR customerEmail LIKE '%@customer.com';");
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
