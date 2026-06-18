const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const DB_FILE = './volunteers.json';
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// GET all volunteers
app.get('/api/volunteers', (req, res) => {
  res.json(readDB());
});

// POST - add volunteer
app.post('/api/volunteers', (req, res) => {
  const volunteers = readDB();
  const newVolunteer = { id: Date.now(), ...req.body, status: 'active' };
  volunteers.push(newVolunteer);
  writeDB(volunteers);
  res.json({ message: 'Volunteer added!', newVolunteer });
});

// PUT - update volunteer
app.put('/api/volunteers/:id', (req, res) => {
  let volunteers = readDB();
  volunteers = volunteers.map(v => v.id == req.params.id ? { ...v, ...req.body } : v);
  writeDB(volunteers);
  res.json({ message: 'Volunteer updated!' });
});

// DELETE - remove volunteer
app.delete('/api/volunteers/:id', (req, res) => {
  let volunteers = readDB();
  volunteers = volunteers.filter(v => v.id != req.params.id);
  writeDB(volunteers);
  res.json({ message: 'Volunteer deleted!' });
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));