const router = require('express').Router()
const {isAdmin} = require('../../authentication/auth')
const Product = require('../../models/product')
const Category = require('../../models/category')

router.get('/', isAdmin, async function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        await Product.find(function(err, products) {
            res.render('admin/admin_products.hbs', {
                title: 'Shop | Products',
                products: products,
                admin: admin
            })
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/add-product', isAdmin, async function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        const title = ""
        const description = ""
        const price = ""
    
        await Category.find(function(err, categories) {
            res.render('admin/add_product.hbs', {
                title: title,
                description: description,
                categories: categories,
                price: price,
                admin: admin
            })
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.post('/add-product', async function (req, res) {
    try {
        const title = req.body.title
        const slug = title.replace(/\s+/g, '-').toLowerCase()
        const description = req.body.description
        const category = req.body.category
        const price = req.body.price

        await Product.findOne({slug: slug}, async function (err, product) {
            if (product) {
                Category.find(function (err, categories) {
                    res.render('admin/add_product.hbs', {
                        title: title,
                        description: description,
                        categories: categories,
                        price: price
                })
            })
            } else {
                const product = new Product({
                    title: title,
                    slug: slug,
                    category: category,
                    description: description,
                    price: price
                })

                await product.save(async function (err) {
                    await Product.find(function(err, products) {
                        if(err) {
                            return console.log(err)
                        } else {
                            req.app.locals.products = products
                        }
                    })
                    res.redirect('/admin/products')
                })
            }
        })
    } catch (error) {
        res.redirect('/admin/products')
    }
})

router.get('/edit-product/:id', isAdmin, async function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        const id = req.params.id
        await Category.find(async function(err, categories) {
            await Product.findById(id, async function (err, product) {
                res.render('admin/edit_product.hbs', {
                    product: product,
                    categories: categories,
                    admin: admin
                })
            })
        })
    } catch (error) {
        res.redirect('/admin/pages')
    }
})

router.post('/edit-product/:id', async function (req, res) {
    try{
        const id = req.params.id
        const title = req.body.title
        const slug = title.replace(/\s+/g, '-').toLowerCase()
        const description = req.body.title
        const category = req.body.category
        const price = req.body.price
        const product = {}
        product.title = title
        product.slug = slug
        product.description = description
        product.category = category
        product.price = price

        await Product.findByIdAndUpdate(id, product, async function(err) {
            await Product.find(function(err, products) {
                if(err) {
                    return console.log(err)
                } else {
                    req.app.locals.products = products
                }
            })
            res.redirect('/admin/products')
        })
    } catch(error) {
        res.redirect('/admin/products')
    }
})

router.get('/delete-product/:id', isAdmin, async function (req, res) {
    const id = req.params.id
    await Product.findByIdAndRemove(id, async function(err) {
        if(err) {
            return console.log(err)
        }
        await Product.find(function(err, products) {
            if(err) {
                return console.log(err)
            } else {
                req.app.locals.products = products
            }
        })
        res.redirect('/admin/products')
    })
})

module.exports = router