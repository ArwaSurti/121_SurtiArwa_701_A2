const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better query performance
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ name: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentCategory'
});

// Ensure virtual fields are serialized
categorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
