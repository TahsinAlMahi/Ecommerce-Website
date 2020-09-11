const router = require('express').Router()
const Product = require('../models/product')

router.get('/add/:product', function (req, res) {
    try {
        const slug = req.params.product
        Product.findOne({
            slug: slug
        }, function (err, product) {
            if (req.session.cart == undefined) {
                req.session.cart = []
                req.session.cart.push({
                    title: slug,
                    qty: 1,
                    price: product.price
                })
            } else {
                const cart = req.session.cart
                var newItem = true

                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].title == slug) {
                        cart[i].qty++
                        newItem = false
                        break
                    }
                }

                if (newItem) {
                    cart.push({
                        title: slug,
                        qty: 1,
                        price: product.price
                    })
                }
            }
            res.redirect('back')
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/checkout', function (req, res) {
    try {
        const cart = req.session.cart

        if (cart == undefined || cart.length == 0) {
            res.render('checkout.hbs', {
                title: 'Shop | Checkout',
                cart: cart,
                total: total
            })
        } else {
            var total = 0
            for (var i = 0; i < cart.length; i++) {
                var subTotal = cart[i].qty * cart[i].price
                var total = total + subTotal
            }
            res.render('checkout.hbs', {
                title: 'Shop | Checkout',
                cart: cart,
                total: total
            })
        }
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/update/:product', function (req, res) {
    try {
        const slug = req.params.product
        const cart = req.session.cart
        const action = req.query.action

        for (var i = 0; i < cart.length; i++) {
            if (cart[i].title == slug) {
                switch (action) {
                    case 'add':
                        cart[i].qty++
                        break
                    case 'remove':
                        cart[i].qty--
                        if (cart[i].qty < 1) {
                            cart.splice(i, 1)
                        }
                        break
                    case 'clear':
                        cart.splice(i, 1)
                        if (cart.length == 0) {
                            delete req.session.cart
                        }
                        break
                    default:
                        console.log('Update problem.')
                        break
                }
                break
            }
        }
        res.redirect('/cart/checkout')
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/clear', function (req, res) {
    delete req.session.cart
    res.redirect('/cart/checkout')
})

module.exports = router