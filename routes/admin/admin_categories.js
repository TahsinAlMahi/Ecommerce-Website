const router = require('express').Router()
const {isAdmin} = require('../../authentication/auth')
const Category = require('../../models/category')

router.get('/', isAdmin, async function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        await Category.find(function (err, categories) {
            res.render('admin/admin_categories.hbs', {
                title: 'Shop | Categories',
                categories: categories,
                admin: admin
            })
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/add-category', isAdmin, function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        const title = ""
        res.render('admin/add_category.hbs', {
            title: title,
            admin: admin
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.post('/add-category', async function (req, res) {
    try {
        const title = req.body.title
        var slug = title.replace(/\s+/g, '-').toLowerCase()

        await Category.findOne({slug: slug}, async function (err, category) {
            if (category) {
                res.render('admin/add_category.hbs', {
                    title: title
                })
            } else {
                const category = new Category({
                    title: title,
                    slug: slug
                })

                await category.save(async function (err) {
                    await Category.find(function (err, categories) {
                        if (err) {
                            return console.log(err)
                        } else {
                            req.app.locals.categories = categories
                        }
                    })
                    res.redirect('/admin/categories')
                })
            }
        })
    } catch (error) {
        res.redirect('/admin/categories')
    }
})

router.get('/edit-category/:id', isAdmin, async function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        const id = req.params.id
        await Category.findById(id, function (err, category) {
            res.render('admin/edit_category.hbs', {
                category: category,
                admin: admin
            })
        })
    } catch (error) {
        res.redirect('/admin/categories')
    }
})

router.post('/edit-category/:id', async function (req, res) {
    try {
        const id = req.params.id
        const title = req.body.title
        const slug = title.replace(/\s+/g, '-').toLowerCase()
        const category = {}
        category.title = req.body.title
        category.slug = slug

        await Category.findByIdAndUpdate(id, category, async function (err) {
            await Category.find(async function (err, categories) {
                if (err) {
                    return console.log(err)
                } else {
                    req.app.locals.categories = categories
                }
            })
            res.redirect('/admin/categories')
        })
    } catch (error) {
        res.redirect('/admin/products')
    }
})

router.get('/delete-category/:id', isAdmin, async function (req, res) {
    const id = req.params.id
    await Category.findByIdAndRemove(id, async function (err) {
        await Category.find(function (err, categories) {
            if (err) {
                return console.log(err)
            } else {
                req.app.locals.categories = categories
            }
        })
        res.redirect('/admin/categories')
    })
})

module.exports = router