const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const { requireAuth } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../config/email');
const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// List all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).sort({ createdAt: -1 });
    res.render('employees/index', { employees, success: req.query.success });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.render('employees/index', { employees: [], error: 'Failed to fetch employees' });
  }
});

// Add employee form
router.get('/add', (req, res) => {
  res.render('employees/add', { error: null });
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const { name, email, department, position, baseSalary, allowances, deductions } = req.body;
    
    // Generate employee ID and temporary password
    const empId = await Employee.generateEmpId();
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const employee = new Employee({
      empId,
      name,
      email,
      password: hashedPassword,
      department,
      position,
      baseSalary: parseFloat(baseSalary),
      allowances: parseFloat(allowances) || 0,
      deductions: parseFloat(deductions) || 0
    });

    await employee.save();

    // Send welcome email
    await sendWelcomeEmail({
      ...employee.toObject(),
      tempPassword
    });

    res.redirect('/employees?success=Employee added successfully');
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      res.render('employees/add', { error: 'Email already exists' });
    } else {
      res.render('employees/add', { error: 'Failed to create employee' });
    }
  }
});

// View employee details
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.redirect('/employees');
    }
    res.render('employees/view', { employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.redirect('/employees');
  }
});

// Edit employee form
router.get('/:id/edit', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.redirect('/employees');
    }
    res.render('employees/edit', { employee, error: null });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.redirect('/employees');
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, department, position, baseSalary, allowances, deductions } = req.body;
    
    const employee = await Employee.findByIdAndUpdate(req.params.id, {
      name,
      email,
      department,
      position,
      baseSalary: parseFloat(baseSalary),
      allowances: parseFloat(allowances) || 0,
      deductions: parseFloat(deductions) || 0
    }, { new: true });

    if (!employee) {
      return res.redirect('/employees');
    }

    res.redirect('/employees?success=Employee updated successfully');
  } catch (error) {
    console.error('Error updating employee:', error);
    const employee = await Employee.findById(req.params.id);
    res.render('employees/edit', { employee, error: 'Failed to update employee' });
  }
});

// Delete employee (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, { isActive: false });
    res.redirect('/employees?success=Employee deleted successfully');
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.redirect('/employees');
  }
});

module.exports = router;
