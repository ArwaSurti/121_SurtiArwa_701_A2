const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');

app.use('/auth', authRoutes);
app.use('/employee', employeeRoutes);

// Home route - redirect to login
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Employee Portal running on port ${PORT}`);
});
