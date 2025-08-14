import mysql from 'mysql2/promise';

// Load dotenv for local development
if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract data from request body
  const { doctorId, patientId, date, time } = req.body;

  if (!doctorId || !patientId || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  let connection;
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT
    });

    // Insert appointment
    const query = `
      INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, 'Confirmed')
    `;
    await connection.execute(query, [doctorId, patientId, date, time]);

    res.status(200).json({ message: 'Appointment Confirmed' });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  } finally {
    if (connection) await connection.end();
  }
}

