const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
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
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Make session data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.isAuthenticated = req.session.isAuthenticated;
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);

// Home route - redirect to login
app.get('/', (req, res) => {
  if (req.session.isAuthenticated) {
    res.redirect('/employees');
  } else {
    res.redirect('/auth/login');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
