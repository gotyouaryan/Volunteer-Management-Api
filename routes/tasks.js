const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const jwt = require('jsonwebtoken');

// Middleware to check login
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token, access denied!' });
  try {
    const decoded = jwt.verify(token, 'secretkey123');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token!' });
  }
};

// Middleware to check admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only!' });
  next();
};

// GET all volunteers (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  const volunteers = await Volunteer.find().select('-password');
  res.json(volunteers);
});

// GET single volunteer
router.get('/:id', auth, async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id).select('-password');
  res.json(volunteer);
});

// UPDATE volunteer (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(volunteer);
});

// DELETE volunteer (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Volunteer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Volunteer deleted!' });
});

module.exports = router;