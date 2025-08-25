# Shopping Cart Application

A full-featured e-commerce shopping cart application with admin and user interfaces built with Node.js, Express, MongoDB, and EJS.

## Features

### Admin Site
- **Admin Authentication**: Secure login for administrators
- **Category Management**: Create, edit, delete categories with 2-level hierarchy (Parent + Subcategory)
- **Product Management**: Full CRUD operations for products with category assignment
- **Order Management**: View all orders, update order status, view order details
- **Dashboard**: System statistics and quick actions

### User Site
- **User Registration & Login**: Secure user authentication system
- **Product Browsing**: Browse products by categories with search functionality
- **Shopping Cart**: Add to cart, update quantities, remove items
- **Checkout Process**: Complete order placement with shipping address
- **Order History**: View past orders and order details
- **User Profile**: Manage personal information and address

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/shopping_cart
   SESSION_SECRET=your_session_secret_key
   PORT=3000
   ```

4. Seed the database with initial data:
   ```bash
   node seed.js
   ```

5. Start the application:
   ```bash
   npm start
   ```

6. For development with auto-restart:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the demo accounts to login:

### Demo Accounts
**Admin Account:**
- Email: admin@shop.com
- Password: admin123

**User Account:**
- Email: user@shop.com
- Password: user123

## Project Structure

```
Ques7/
├── models/
│   ├── User.js          # User data model
│   ├── Category.js      # Category data model
│   ├── Product.js       # Product data model
│   ├── Order.js         # Order data model
│   └── Cart.js          # Shopping cart model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── admin.js         # Admin panel routes
│   ├── user.js          # User interface routes
│   └── cart.js          # Shopping cart routes
├── views/
│   ├── auth/            # Authentication templates
│   ├── admin/           # Admin panel templates
│   ├── user/            # User interface templates
│   └── error.ejs        # Error page template
├── middleware/
│   └── adminAuth.js     # Authentication middleware
├── server.js            # Main application file
├── seed.js              # Database seeding script
├── package.json
├── .env
└── README.md
```

## API Routes

### Authentication
- `GET /auth/login` - Login page
- `GET /auth/register` - Registration page
- `POST /auth/login` - Process login
- `POST /auth/register` - Process registration
- `POST /auth/logout` - Logout

### Admin Routes (Protected)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/categories` - Manage categories
- `GET /admin/products` - Manage products
- `GET /admin/orders` - View orders

### User Routes (Protected)
- `GET /user/dashboard` - User dashboard
- `GET /user/categories` - Browse categories
- `GET /user/products/:id` - Product details
- `GET /user/orders` - Order history

### Cart Routes (Protected)
- `GET /cart` - View cart
- `POST /cart/add` - Add to cart
- `PUT /cart/update/:productId` - Update cart item
- `DELETE /cart/remove/:productId` - Remove from cart
- `GET /cart/checkout` - Checkout page
- `POST /cart/checkout` - Process checkout

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Template Engine**: EJS (with simple table layouts, no CSS)
- **Authentication**: Session-based authentication
- **Password Hashing**: bcryptjs
- **Session Management**: express-session

## Database Schema

### User
- Personal information (name, email, password)
- Role (admin/user)
- Address information
- Phone number

### Category
- Name and description
- Parent-child relationship for subcategories
- Active status

### Product
- Name, description, price
- Category assignment
- Stock management
- SKU and weight information

### Order
- User reference
- Order items with quantities and prices
- Shipping address
- Order status tracking
- Payment method

### Cart
- User-specific shopping cart
- Cart items with quantities
- Automatic total calculation

## License

MIT
