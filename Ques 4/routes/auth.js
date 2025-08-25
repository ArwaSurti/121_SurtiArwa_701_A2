const express = require('express');
const bcrypt = require('bcryptjs');
const { redirectIfAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Login page
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check admin credentials
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      req.session.isAuthenticated = true;
      req.session.user = { username: username, role: 'admin' };
      res.redirect('/employees');
    } else {
      res.render('auth/login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { error: 'Login failed. Please try again.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
