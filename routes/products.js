const router = require('express').Router()
const Category = require('../models/category')
const Product = require('../models/product')

// router.get('/', function (req, res) {
//     try {
//         Product.find(function(err, products) {
//             res.render('all_products.hbs', {
//                 title: 'Shop | All Products',
//                 products: products
//             })
//         })
//     } catch(error) {
//         res.redirect('/')
//     }
// })

router.get('/:category',  async function (req, res) {
    try {
        const categorySlug = req.params.category

        await Category.findOne({slug: categorySlug}, async function(err, category) {
            await Product.find({category: categorySlug},function(err, products) {
                res.render('cat_products.hbs', {
                    title: 'Shop | '+category.title,
                    products: products
                })
            })
        })
    } catch(error) {
        res.redirect('/')
    }
})

router.get('/:category/:product', async function (req, res) {
    try {
        const productSlug = req.params.product
        const loggedIn = (req.isAuthenticated()) ? true : false
    
        await Product.findOne({slug: productSlug},function(err, product) {
            res.render('product.hbs', {
                product: product,
                loggedIn: loggedIn
            })
        })
    } catch(error) {
        res.redirect('/')
    }
})

module.exports = router