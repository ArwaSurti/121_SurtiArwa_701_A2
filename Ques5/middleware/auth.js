const { verifyToken } = require('../config/jwt');
const Employee = require('../models/Employee');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = verifyToken(token);
    const employee = await Employee.findById(decoded.id);
    
    if (!employee || !employee.isActive) {
      res.clearCookie('token');
      return res.redirect('/auth/login');
    }

    req.employee = employee;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  }
};

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  
  if (token) {
    try {
      verifyToken(token);
      return res.redirect('/employee/dashboard');
    } catch (error) {
      res.clearCookie('token');
    }
  }
  
  next();
};

module.exports = {
  authenticateToken,
  redirectIfAuthenticated
};
