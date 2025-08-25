const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

// Register page
router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', { error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('auth/login', { error: 'Invalid credentials' });
        }
        
        // Set session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/user/dashboard');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', { error: 'Server error' });
    }
});

// Register POST
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            return res.render('auth/register', { error: 'Passwords do not match' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/register', { error: 'Email already registered' });
        }
        
        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            role: 'user' // Default role
        });
        
        await user.save();
        
        // Set session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        res.redirect('/user/dashboard');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', { error: 'Server error' });
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
