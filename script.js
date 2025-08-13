// script.js
require('dotenv').config(); // Load variables from .env

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000; // Use Railway port if hosted

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// Handle appointment submission
app.post('/bookAppointment', (req, res) => {
  const { doctorId, patientId, date, time } = req.body;

  const insertQuery = `
    INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, status)
    VALUES (?, ?, ?, ?, 'Confirmed')
  `;

  db.query(insertQuery, [doctorId, patientId, date, time], (err, result) => {
    if (err) {
      return res.send(`<h3>Database error: ${err.message}</h3>`);
    }

    res.send(`
      <h2>Appointment Confirmed</h2>
      <p><strong>Doctor ID:</strong> ${doctorId}</p>
      <p><strong>Patient ID:</strong> ${patientId}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
    `);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
