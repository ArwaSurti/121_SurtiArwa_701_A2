const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (employee) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: 'Welcome to ERP System - Your Account Details',
      html: `
        <h2>Welcome to ERP System</h2>
        <p>Dear ${employee.name},</p>
        <p>Your employee account has been created successfully. Here are your login details:</p>
        <ul>
          <li><strong>Employee ID:</strong> ${employee.empId}</li>
          <li><strong>Email:</strong> ${employee.email}</li>
          <li><strong>Temporary Password:</strong> ${employee.tempPassword}</li>
          <li><strong>Department:</strong> ${employee.department}</li>
          <li><strong>Position:</strong> ${employee.position}</li>
          <li><strong>Base Salary:</strong> ₹${employee.baseSalary}</li>
        </ul>
        <p><strong>Please change your password after first login.</strong></p>
        <p>Best regards,<br>ERP Admin Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', employee.email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendWelcomeEmail
};
