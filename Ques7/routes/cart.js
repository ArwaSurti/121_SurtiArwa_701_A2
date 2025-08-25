const express = require('express');
const { userAuth } = require('../middleware/adminAuth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// Apply user authentication to all routes
router.use(userAuth);

// View Cart
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.session.user.id })
            .populate('items.product', 'name price stock');
        
        if (!cart) {
            cart = { items: [], totalAmount: 0 };
        }
        
        res.render('user/cart', {
            user: req.session.user,
            cart
        });
    } catch (error) {
        console.error('Cart view error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Add to Cart
router.post('/add', async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        // Check if product exists and is active
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        
        let cart = await Cart.findOne({ user: req.session.user.id });
        
        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: req.session.user.id,
                items: [{ product: productId, quantity: parseInt(quantity) }]
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(item => 
                item.product.toString() === productId
            );
            
            if (existingItem) {
                existingItem.quantity += parseInt(quantity);
                
                // Check total quantity against stock
                if (existingItem.quantity > product.stock) {
                    return res.status(400).json({ error: 'Insufficient stock' });
                }
            } else {
                cart.items.push({ product: productId, quantity: parseInt(quantity) });
            }
        }
        
        await cart.save();
        res.json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Cart Item Quantity
router.put('/update/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.productId;
        
        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }
        
        // Check product stock
        const product = await Product.findById(productId);
        if (!product || quantity > product.stock) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        
        const cart = await Cart.findOne({ user: req.session.user.id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        
        const item = cart.items.find(item => 
            item.product.toString() === productId
        );
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }
        
        item.quantity = parseInt(quantity);
        await cart.save();
        
        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from Cart
router.delete('/remove/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        
        const cart = await Cart.findOne({ user: req.session.user.id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(item => 
            item.product.toString() !== productId
        );
        
        await cart.save();
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Checkout Page
router.get('/checkout', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user.id })
            .populate('items.product', 'name price stock');
        
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }
        
        // Check stock availability for all items
        for (let item of cart.items) {
            if (item.quantity > item.product.stock) {
                return res.redirect('/cart?error=stock');
            }
        }
        
        const user = await User.findById(req.session.user.id);
        
        res.render('user/checkout', {
            user: req.session.user,
            cart,
            userDetails: user
        });
    } catch (error) {
        console.error('Checkout page error:', error);
        res.status(500).render('error', { message: 'Server error', user: req.session.user });
    }
});

// Process Checkout
router.post('/checkout', async (req, res) => {
    try {
        const { street, city, state, zipCode, country, paymentMethod, notes } = req.body;
        
        const cart = await Cart.findOne({ user: req.session.user.id })
            .populate('items.product', 'name price stock');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        
        // Validate stock and calculate total
        let totalAmount = 0;
        const orderItems = [];
        
        for (let item of cart.items) {
            if (item.quantity > item.product.stock) {
                return res.status(400).json({ 
                    error: `Insufficient stock for ${item.product.name}` 
                });
            }
            
            const itemTotal = item.product.price * item.quantity;
            totalAmount += itemTotal;
            
            orderItems.push({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            });
            
            // Update product stock
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }
        
        // Create order
        const order = new Order({
            user: req.session.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress: {
                street,
                city,
                state,
                zipCode,
                country
            },
            paymentMethod,
            notes
        });
        
        await order.save();
        
        // Clear cart
        await Cart.findOneAndDelete({ user: req.session.user.id });
        
        res.redirect(`/user/orders/${order._id}?success=1`);
    } catch (error) {
        console.error('Checkout process error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
