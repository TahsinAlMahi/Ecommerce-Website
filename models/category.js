const mongoose = require('mongoose')
require('../db/mongoose')

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
})

const Category = mongoose.model('Category', categorySchema, 'categories')

module.exports = Category