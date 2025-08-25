const express = require('express');
const { userAuth } = require('../middleware/adminAuth');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const router = express.Router();

// Helper function to get cart item count
const getCartItemCount = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId });
        return cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
    } catch (error) {
        console.error('Error getting cart item count:', error);
        return 0;
    }
};

// Apply user authentication to all routes
router.use(userAuth);

// User Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const categories = await Category.find({ parentCategory: null, isActive: true }).sort({ name: 1 });
        const featuredProducts = await Product.find({ isActive: true }).populate('category').limit(8).sort({ createdAt: -1 });
        
        // Get cart item count
        const cartItemCount = await getCartItemCount(req.session.user.id);
        
        res.render('user/dashboard', {
            user: req.session.user,
            categories,
            featuredProducts,
            cartItemCount
        });
    } catch (error) {
        console.error('User dashboard error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Browse Categories
router.get('/categories', async (req, res) => {
    try {
        const parentCategories = await Category.find({ parentCategory: null, isActive: true })
            .populate('subcategories')
            .sort({ name: 1 });
        
        res.render('user/categories', {
            user: req.session.user,
            categories: parentCategories
        });
    } catch (error) {
        console.error('Categories browse error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Browse Products by Category
router.get('/categories/:id/products', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        const products = await Product.find({ 
            category: req.params.id, 
            isActive: true 
        }).populate('category').sort({ name: 1 });
        
        res.render('user/products', {
            user: req.session.user,
            category,
            products
        });
    } catch (error) {
        console.error('Products browse error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Product Details
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        
        if (!product || !product.isActive) {
            return res.status(404).render('error', { 
                message: 'Product not found', 
                user: req.session.user 
            });
        }
        
        res.render('user/product-details', {
            user: req.session.user,
            product
        });
    } catch (error) {
        console.error('Product details error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Search Products
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        let products = [];
        
        if (q && q.trim()) {
            products = await Product.find({
                $and: [
                    { isActive: true },
                    {
                        $or: [
                            { name: { $regex: q, $options: 'i' } },
                            { description: { $regex: q, $options: 'i' } }
                        ]
                    }
                ]
            }).populate('category').sort({ name: 1 });
        }
        
        res.render('user/search-results', {
            user: req.session.user,
            products,
            searchQuery: q || ''
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Order History
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.user.id })
            .populate('items.product', 'name price')
            .sort({ orderDate: -1 });
        
        res.render('user/order-history', {
            user: req.session.user,
            orders
        });
    } catch (error) {
        console.error('Order history error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Order Details
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ 
            _id: req.params.id, 
            user: req.session.user.id 
        }).populate('items.product', 'name price sku');
        
        if (!order) {
            return res.status(404).render('error', { 
                message: 'Order not found', 
                user: req.session.user 
            });
        }
        
        res.render('user/order-details', {
            user: req.session.user,
            order
        });
    } catch (error) {
        console.error('Order details error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// User Profile
router.get('/profile', (req, res) => {
    res.render('user/profile', {
        user: req.session.user
    });
});

router.post('/profile', async (req, res) => {
    try {
        const { name, phone, street, city, state, zipCode, country } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(req.session.user.id, {
            name,
            phone,
            'address.street': street,
            'address.city': city,
            'address.state': state,
            'address.zipCode': zipCode,
            'address.country': country
        }, { new: true });
        
        // Update session
        req.session.user.name = updatedUser.name;
        
        res.redirect('/user/profile?success=1');
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

module.exports = router;
