const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const { generateToken } = require('../config/jwt');
const { redirectIfAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Login page
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  const { empId, name } = req.body;

  try {
    // Find employee by empId and name
    const employee = await Employee.findOne({ 
      empId: empId, 
      name: name, 
      isActive: true 
    });
    
    if (!employee) {
      return res.render('auth/login', { error: 'Invalid Employee ID or Name' });
    }

    // Generate JWT token
    const token = generateToken({ 
      id: employee._id, 
      empId: employee.empId,
      name: employee.name 
    });

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.redirect('/employee/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { error: 'Login failed. Please try again.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

module.exports = router;
