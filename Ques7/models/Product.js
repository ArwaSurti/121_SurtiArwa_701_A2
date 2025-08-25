const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        trim: true
    },
    images: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    weight: {
        type: Number,
        min: 0
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    }
}, {
    timestamps: true
});

// Index for better query performance
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
