// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --------- CRUD ROUTES FOR PATIENTS ---------

// GET all patients
app.get('/api/patients', (req, res) => {
  const sql = 'SELECT * FROM patients ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET one patient by ID
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM patients WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching patient:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(results[0]);
  });
});

// CREATE patient
app.post('/api/patients', (req, res) => {
  const { name, age, gender, phone, disease } = req.body;

  if (!name || !age || !gender) {
    return res.status(400).json({ error: 'Name, age, and gender are required' });
  }

  const sql = 'INSERT INTO patients (name, age, gender, phone, disease) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, age, gender, phone, disease], (err, result) => {
    if (err) {
      console.error('Error creating patient:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, name, age, gender, phone, disease });
  });
});

// UPDATE patient
app.put('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, gender, phone, disease } = req.body;

  if (!name || !age || !gender) {
    return res.status(400).json({ error: 'Name, age, and gender are required' });
  }

  const sql = `
    UPDATE patients 
    SET name = ?, age = ?, gender = ?, phone = ?, disease = ?
    WHERE id = ?
  `;
  db.query(sql, [name, age, gender, phone, disease, id], (err, result) => {
    if (err) {
      console.error('Error updating patient:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient updated successfully' });
  });
});

// DELETE patient
app.delete('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM patients WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting patient:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Hospital Management Backend Running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
