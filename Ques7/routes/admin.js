const express = require('express');
const { adminAuth } = require('../middleware/adminAuth');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// Apply admin authentication to all routes
router.use(adminAuth);

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        
        res.render('admin/dashboard', {
            user: req.session.user,
            stats: {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                pendingOrders
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Categories Management
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().populate('parentCategory').sort({ name: 1 });
        res.render('admin/categories', { user: req.session.user, categories });
    } catch (error) {
        console.error('Categories fetch error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.get('/categories/new', async (req, res) => {
    try {
        const parentCategories = await Category.find({ parentCategory: null }).sort({ name: 1 });
        res.render('admin/category-form', { 
            user: req.session.user, 
            category: null, 
            parentCategories,
            action: 'Add'
        });
    } catch (error) {
        console.error('Category form error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.post('/categories', async (req, res) => {
    try {
        const { name, description, parentCategory } = req.body;
        
        const category = new Category({
            name,
            description,
            parentCategory: parentCategory || null
        });
        
        await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Category creation error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.get('/categories/:id/edit', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        const parentCategories = await Category.find({ 
            parentCategory: null, 
            _id: { $ne: req.params.id } 
        }).sort({ name: 1 });
        
        res.render('admin/category-form', { 
            user: req.session.user, 
            category, 
            parentCategories,
            action: 'Edit'
        });
    } catch (error) {
        console.error('Category edit error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const { name, description, parentCategory } = req.body;
        
        await Category.findByIdAndUpdate(req.params.id, {
            name,
            description,
            parentCategory: parentCategory || null
        });
        
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Category update error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        // Check if category has products
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({ error: 'Cannot delete category with products' });
        }
        
        // Check if category has subcategories
        const subcategoryCount = await Category.countDocuments({ parentCategory: req.params.id });
        if (subcategoryCount > 0) {
            return res.status(400).json({ error: 'Cannot delete category with subcategories' });
        }
        
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Category deletion error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Products Management
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().populate('category').sort({ name: 1 });
        res.render('admin/products', { user: req.session.user, products });
    } catch (error) {
        console.error('Products fetch error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.get('/products/new', async (req, res) => {
    try {
        const categories = await Category.find().populate('parentCategory').sort({ name: 1 });
        res.render('admin/product-form', { 
            user: req.session.user, 
            product: null, 
            categories,
            action: 'Add'
        });
    } catch (error) {
        console.error('Product form error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.post('/products', async (req, res) => {
    try {
        const { name, description, price, category, stock, sku, weight } = req.body;
        
        const product = new Product({
            name,
            description,
            price: parseFloat(price),
            category,
            stock: parseInt(stock),
            sku,
            weight: weight ? parseFloat(weight) : undefined
        });
        
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.get('/products/:id/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find().populate('parentCategory').sort({ name: 1 });
        
        res.render('admin/product-form', { 
            user: req.session.user, 
            product, 
            categories,
            action: 'Edit'
        });
    } catch (error) {
        console.error('Product edit error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const { name, description, price, category, stock, sku, weight } = req.body;
        
        await Product.findByIdAndUpdate(req.params.id, {
            name,
            description,
            price: parseFloat(price),
            category,
            stock: parseInt(stock),
            sku,
            weight: weight ? parseFloat(weight) : undefined
        });
        
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Product deletion error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Orders Management
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort({ orderDate: -1 });
        
        res.render('admin/orders', { user: req.session.user, orders });
    } catch (error) {
        console.error('Orders fetch error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name price sku');
        
        res.render('admin/order-details', { user: req.session.user, order });
    } catch (error) {
        console.error('Order details error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Order status update error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

module.exports = router;
