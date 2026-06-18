const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Volunteer = require('../models/Volunteer');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if volunteer already exists
    const existing = await Volunteer.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists!' });

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create volunteer
    const volunteer = new Volunteer({ name, email, password: hashedPassword, role });
    await volunteer.save();

    res.json({ message: 'Registered successfully!', volunteer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find volunteer
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) return res.status(400).json({ message: 'Email not found!' });

    // Check password
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password!' });

    // Create token
    const token = jwt.sign(
      { id: volunteer._id, role: volunteer.role },
      'secretkey123',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful!', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;