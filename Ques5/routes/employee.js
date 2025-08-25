const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('employee/dashboard', { employee: req.employee });
});

// Profile view
router.get('/profile', (req, res) => {
  res.render('employee/profile', { employee: req.employee, success: null, error: null });
});

// Update profile
router.post('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.employee._id,
      { name, email },
      { new: true }
    );

    res.render('employee/profile', { 
      employee: updatedEmployee, 
      success: 'Profile updated successfully',
      error: null 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.render('employee/profile', { 
      employee: req.employee, 
      success: null,
      error: 'Failed to update profile' 
    });
  }
});

// Change password page
router.get('/change-password', (req, res) => {
  res.render('employee/change-password', { success: null, error: null });
});

// Change password POST
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate new password
    if (newPassword !== confirmPassword) {
      return res.render('employee/change-password', { 
        success: null, 
        error: 'New passwords do not match' 
      });
    }

    if (newPassword.length < 6) {
      return res.render('employee/change-password', { 
        success: null, 
        error: 'New password must be at least 6 characters long' 
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, req.employee.password);
    
    if (!isValidPassword) {
      return res.render('employee/change-password', { 
        success: null, 
        error: 'Current password is incorrect' 
      });
    }

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await Employee.findByIdAndUpdate(req.employee._id, { password: hashedNewPassword });

    res.render('employee/change-password', { 
      success: 'Password changed successfully', 
      error: null 
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.render('employee/change-password', { 
      success: null, 
      error: 'Failed to change password' 
    });
  }
});

module.exports = router;
