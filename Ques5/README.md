# Employee Portal - JWT Authentication

An employee portal application built with Node.js, Express, MongoDB, and JWT authentication. Employees can login, view their dashboard, update profile, and change passwords.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Employee Dashboard**: View personal and salary information
- **Profile Management**: Update name and email
- **Password Change**: Secure password update functionality
- **Basic HTML UI**: Simple table-based layout without CSS
- **Cookie-based Token Storage**: Secure HTTP-only cookies

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Employee data from Q4 admin panel

## Installation

1. **Navigate to project directory:**
   ```bash
   cd Ques5
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Update the `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/employee_portal
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
   JWT_EXPIRES_IN=24h
   PORT=3001
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running.

5. **Run the application:**
   ```bash
   npm start
   ```

## Usage

1. **Access the application:**
   Open browser and go to `http://localhost:3001`

2. **Login as Employee:**
   - Employee ID: Use the ID created from Q4 admin panel (e.g., EMP0001)
   - Password: Use the temporary password sent via email

3. **Employee Features:**
   - View dashboard with personal and salary information
   - Update profile (name and email)
   - Change password securely

## Project Structure

```
Ques5/
├── config/
│   └── jwt.js              # JWT utilities
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   └── Employee.js        # Employee MongoDB schema
├── routes/
│   ├── auth.js           # Authentication routes
│   └── employee.js       # Employee routes
├── views/
│   ├── auth/
│   │   └── login.ejs     # Login page
│   └── employee/
│       ├── dashboard.ejs  # Employee dashboard
│       ├── profile.ejs    # Profile update
│       └── change-password.ejs # Password change
├── .env                   # Environment variables
├── package.json          # Dependencies
├── server.js             # Main server file
└── README.md             # This file
```

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login (returns JWT token)
- `POST /auth/logout` - Logout (clears token)

### Employee Portal
- `GET /employee/dashboard` - Employee dashboard
- `GET /employee/profile` - Profile update form
- `POST /employee/profile` - Update profile
- `GET /employee/change-password` - Password change form
- `POST /employee/change-password` - Change password

## JWT Implementation

- **Token Generation**: JWT tokens are generated on successful login
- **Token Storage**: Tokens stored in HTTP-only cookies
- **Token Verification**: Middleware verifies tokens on protected routes
- **Token Expiry**: Tokens expire after 24 hours (configurable)

## UI Design

- **No CSS**: Uses basic HTML table layouts as requested
- **Simple Forms**: Standard HTML form elements
- **Color Coding**: Basic bgcolor attributes for visual distinction
- **Responsive**: Table-based layout works on different screen sizes

## Security Features

- JWT token-based authentication
- HTTP-only cookies prevent XSS attacks
- Password hashing with bcryptjs
- Token expiration for security
- Protected routes with middleware

## Connection to Q4

This employee portal connects to the same MongoDB database as the Q4 admin panel:
- Employees created in Q4 can login here
- Uses same Employee schema and data
- Employees use their assigned Employee ID and temporary password

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Template Engine**: EJS
- **Password Encryption**: bcryptjs
- **Frontend**: Basic HTML tables (no CSS)

## Default Port

The application runs on port 3001 to avoid conflicts with the Q4 admin panel (port 3000).

## License

MIT License
