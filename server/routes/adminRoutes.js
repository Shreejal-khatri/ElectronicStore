const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/User'); 
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

//Register admin 
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 12);
  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password: hashed,
    role: 'admin'
  });

  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ message: 'Admin created', token, admin });
});

//Login admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || admin.role !== 'admin') return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful', token, admin });
});


//Get current user (admin)
router.get('/me', adminAuth, async (req, res) => {
  try {
    // req.user is set by adminAuth
    const userWithoutPassword = { ...req.user._doc };
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
