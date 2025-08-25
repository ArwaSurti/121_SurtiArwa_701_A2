# ERP Admin Panel - Employee Management System

A complete ERP admin panel built with Node.js, Express, MongoDB, and EJS for managing employees with CRUD operations, salary calculations, and email notifications.

## Features

- **Admin Authentication**: Secure login system with session management
- **Employee Management**: Complete CRUD operations for employees
- **Auto-generated Employee ID**: Automatic employee ID generation (EMP0001, EMP0002, etc.)
- **Password Encryption**: Secure password hashing using bcryptjs
- **Salary Calculator**: Automatic salary calculation with allowances and deductions
- **Email Notifications**: Welcome emails sent to new employees with login credentials
- **Responsive UI**: Modern Bootstrap-based interface
- **Session Management**: Secure session handling with logout functionality

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account for email notifications

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "Ques 4"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Update the `.env` file with your settings:
   ```
   MONGODB_URI=mongodb://localhost:27017/erp_admin
   SESSION_SECRET=your_super_secret_session_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=3000
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Run the application:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Usage

1. **Access the application:**
   Open your browser and go to `http://localhost:3000`

2. **Login as Admin:**
   - Username: `admin`
   - Password: `admin123`

3. **Manage Employees:**
   - Add new employees with auto-generated IDs
   - View, edit, and delete employee records
   - Automatic salary calculations
   - Email notifications to new employees

## Project Structure

```
Ques 4/
├── config/
│   └── email.js          # Email configuration
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   └── Employee.js       # Employee MongoDB schema
├── routes/
│   ├── auth.js          # Authentication routes
│   └── employees.js     # Employee CRUD routes
├── views/
│   ├── auth/
│   │   └── login.ejs    # Login page
│   └── employees/
│       ├── index.ejs    # Employee list
│       ├── add.ejs      # Add employee form
│       ├── edit.ejs     # Edit employee form
│       └── view.ejs     # Employee details
├── .env                 # Environment variables
├── package.json         # Dependencies
├── server.js           # Main server file
└── README.md           # This file
```

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `POST /auth/logout` - Logout

### Employees
- `GET /employees` - List all employees
- `GET /employees/add` - Add employee form
- `POST /employees` - Create new employee
- `GET /employees/:id` - View employee details
- `GET /employees/:id/edit` - Edit employee form
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee (soft delete)

## Employee Schema

- **empId**: Auto-generated unique ID (EMP0001, EMP0002, etc.)
- **name**: Full name
- **email**: Email address (unique)
- **password**: Encrypted password
- **department**: Employee department
- **position**: Job position
- **baseSalary**: Base salary amount
- **allowances**: Additional allowances
- **deductions**: Salary deductions
- **totalSalary**: Calculated total salary
- **joiningDate**: Date of joining
- **isActive**: Active status

## Email Configuration

To enable email notifications:

1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password
4. Update EMAIL_USER and EMAIL_PASS in .env file

## Security Features

- Password encryption using bcryptjs
- Session-based authentication
- CSRF protection with method override
- Input validation and sanitization
- Secure session configuration

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Template Engine**: EJS
- **Authentication**: Express-session
- **Password Encryption**: bcryptjs
- **Email**: Nodemailer
- **Frontend**: Bootstrap 5, Font Awesome
- **Development**: Nodemon

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the default admin credentials in production!

## License

MIT License
