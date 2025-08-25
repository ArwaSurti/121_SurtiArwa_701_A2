const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSalary: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate total salary
employeeSchema.pre('save', function(next) {
  this.totalSalary = this.baseSalary + this.allowances - this.deductions;
  next();
});

// Static method to generate employee ID
employeeSchema.statics.generateEmpId = async function() {
  const count = await this.countDocuments();
  return `EMP${String(count + 1).padStart(4, '0')}`;
};

module.exports = mongoose.model('Employee', employeeSchema);
