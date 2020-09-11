const mongoose = require('mongoose')
require('../db/mongoose')

const pageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    }
    
})

const Page = mongoose.model('Page', pageSchema, 'pages')

module.exports = Page