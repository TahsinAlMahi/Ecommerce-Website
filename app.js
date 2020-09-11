const path = require('path')
const express = require('express')
const hbs = require('hbs')
const session = require('express-session')
const passport = require('passport')
const {authentication} = require('./authentication/auth')
require('./db/mongoose')
const pages = require('./routes/pages')
const products = require('./routes/products')
const cart = require('./routes/cart')
const users = require('./routes/users')
const admin_pages = require('./routes/admin/admin_pages')
const admin_categories = require('./routes/admin/admin_categories')
const admin_products = require('./routes/admin/admin_products')
const Page = require('./models/page')
const Category = require('./models/category')
const Product = require('./models/product')

const app = express()

const publicDirectory = path.join(__dirname, 'public')
const viewsPath = path.join(__dirname, '/public/templates/views')
const partialsPath = path.join(__dirname, '/public/templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
hbs.registerHelper('multiply', function(value1, value2) {return value1 * value2})

app.use(session({
    secret: 'secret-shop',
    resave: false,
    saveUninitialized: false
}))
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    next()
})
app.use(express.static(publicDirectory))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(passport.initialize())
app.use(passport.session())

Page.find(function(err, pages) {
    if(err) {
        return console.log(err)
    } else {
        app.locals.pages = pages
    }
})

Category.find(function(err, categories) {
    if(err) {
        return console.log(err)
    } else {
        app.locals.categories = categories
    }
})

Product.find(function(err, products) {
    if(err) {
        return console.log(err)
    } else {
        app.locals.products = products
    }
})

app.get('*', function(req, res, next) {
    res.locals.cart = req.session.cart
    res.locals.user = req.user || null
    next()
 })

app.use('/', pages)
app.use('/products', products)
app.use('/cart', cart)
app.use('/users', users)
app.use('/admin/pages', admin_pages)
app.use('/admin/categories', admin_categories)
app.use('/admin/products', admin_products)

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('Server started on port ' + port)
})