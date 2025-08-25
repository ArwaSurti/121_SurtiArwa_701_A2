const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping_cart', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@shop.com',
            password: 'admin123',
            role: 'admin'
        });
        await admin.save();
        console.log('Admin user created');

        // Create regular user
        const user = new User({
            name: 'John Doe',
            email: 'user@shop.com',
            password: 'user123',
            role: 'user',
            phone: '123-456-7890'
        });
        await user.save();
        console.log('Regular user created');

        // Create main categories
        const electronics = new Category({
            name: 'Electronics',
            description: 'Electronic devices and gadgets'
        });
        await electronics.save();

        const clothing = new Category({
            name: 'Clothing',
            description: 'Fashion and apparel'
        });
        await clothing.save();

        const books = new Category({
            name: 'Books',
            description: 'Books and literature'
        });
        await books.save();

        const home = new Category({
            name: 'Home & Garden',
            description: 'Home improvement and garden supplies'
        });
        await home.save();

        console.log('Main categories created');

        // Create subcategories
        const smartphones = new Category({
            name: 'Smartphones',
            description: 'Mobile phones and accessories',
            parentCategory: electronics._id
        });
        await smartphones.save();

        const laptops = new Category({
            name: 'Laptops',
            description: 'Portable computers',
            parentCategory: electronics._id
        });
        await laptops.save();

        const mensClothing = new Category({
            name: 'Men\'s Clothing',
            description: 'Clothing for men',
            parentCategory: clothing._id
        });
        await mensClothing.save();

        const womensClothing = new Category({
            name: 'Women\'s Clothing',
            description: 'Clothing for women',
            parentCategory: clothing._id
        });
        await womensClothing.save();

        console.log('Subcategories created');

        // Create products
        const products = [
            {
                name: 'iPhone 15 Pro',
                description: 'Latest Apple smartphone with advanced features',
                price: 999.99,
                category: smartphones._id,
                stock: 50,
                sku: 'IPH15PRO',
                weight: 0.2
            },
            {
                name: 'Samsung Galaxy S24',
                description: 'Premium Android smartphone with excellent camera',
                price: 899.99,
                category: smartphones._id,
                stock: 30,
                sku: 'SAMS24',
                weight: 0.18
            },
            {
                name: 'MacBook Pro 16"',
                description: 'Powerful laptop for professionals',
                price: 2499.99,
                category: laptops._id,
                stock: 15,
                sku: 'MBP16',
                weight: 2.1
            },
            {
                name: 'Dell XPS 13',
                description: 'Compact and powerful ultrabook',
                price: 1299.99,
                category: laptops._id,
                stock: 25,
                sku: 'DELLXPS13',
                weight: 1.2
            },
            {
                name: 'Men\'s Cotton T-Shirt',
                description: 'Comfortable cotton t-shirt for everyday wear',
                price: 19.99,
                category: mensClothing._id,
                stock: 100,
                sku: 'MTSHIRT01',
                weight: 0.2
            },
            {
                name: 'Men\'s Jeans',
                description: 'Classic blue denim jeans',
                price: 49.99,
                category: mensClothing._id,
                stock: 75,
                sku: 'MJEANS01',
                weight: 0.6
            },
            {
                name: 'Women\'s Summer Dress',
                description: 'Light and comfortable summer dress',
                price: 39.99,
                category: womensClothing._id,
                stock: 60,
                sku: 'WDRESS01',
                weight: 0.3
            },
            {
                name: 'Women\'s Blouse',
                description: 'Elegant blouse for office wear',
                price: 29.99,
                category: womensClothing._id,
                stock: 80,
                sku: 'WBLOUSE01',
                weight: 0.25
            },
            {
                name: 'JavaScript: The Good Parts',
                description: 'Essential book for JavaScript developers',
                price: 24.99,
                category: books._id,
                stock: 40,
                sku: 'JSBOOK01',
                weight: 0.4
            },
            {
                name: 'Clean Code',
                description: 'A handbook of agile software craftsmanship',
                price: 32.99,
                category: books._id,
                stock: 35,
                sku: 'CLEANCODE',
                weight: 0.5
            },
            {
                name: 'Garden Tool Set',
                description: 'Complete set of essential garden tools',
                price: 79.99,
                category: home._id,
                stock: 20,
                sku: 'GARDEN01',
                weight: 2.5
            },
            {
                name: 'LED Desk Lamp',
                description: 'Energy-efficient LED desk lamp',
                price: 34.99,
                category: home._id,
                stock: 45,
                sku: 'LEDLAMP01',
                weight: 0.8
            }
        ];

        for (const productData of products) {
            const product = new Product(productData);
            await product.save();
        }

        console.log('Products created');
        console.log('Database seeded successfully!');
        
        console.log('\n=== LOGIN CREDENTIALS ===');
        console.log('Admin Login:');
        console.log('Email: admin@shop.com');
        console.log('Password: admin123');
        console.log('\nUser Login:');
        console.log('Email: user@shop.com');
        console.log('Password: user123');
        console.log('========================\n');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seed function
seedDatabase();
