const mongoose = require('mongoose')
require('../db/mongoose')

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    
})

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product