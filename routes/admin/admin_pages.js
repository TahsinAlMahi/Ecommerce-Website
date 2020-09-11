const router = require('express').Router()
const {isAdmin} = require('../../authentication/auth')
const Page = require('../../models/page')

router.get('/', isAdmin, async function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        await Page.find(function(err, pages) {
            res.render('admin/admin_pages.hbs', {
                title: 'Admin | Pages',
                pages: pages,
                admin: admin
            })
        })
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/add-page', isAdmin, function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        const title = ""
        const slug = ""
        const content = ""
        res.render('admin/add_page.hbs', {
            title: title,
            slug: slug,
            content: content,
            admin: admin
        })   
    } catch (error) {
        res.redirect('/')
    }
})

router.post('/add-page', async function (req, res) {
    try {
        const title = req.body.title
        var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase()
        if (slug == "")
            slug = title.replace(/\s+/g, '-').toLowerCase()
        const content = req.body.content

        await Page.findOne({slug: slug}, async function (err, page) {
            if (page) {
                res.render('admin/add_page.hbs', {
                    title: title,
                    slug: slug,
                    content: content
                })
            } else {
                const page = new Page({
                    title: title,
                    slug: slug,
                    content: content
                })

                await page.save(async function (err) {
                    if (err) {
                        return console.log(err)
                    }
                    await Page.find(function(err, pages) {
                        if(err) {
                            return console.log(err)
                        } else {
                            req.app.locals.pages = pages
                        }
                    })
                    res.redirect('/admin/pages')
                })
            }
        })
    } catch (error) {
        res.redirect('/admin/pages')
    }
})

router.get('/edit-page/:id', isAdmin, async function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        const id = req.params.id
        await Page.findById(id, async function (err, page) {
            res.render('admin/edit_page.hbs', {
                page: page,
                admin: admin
            })
        })
    } catch (error) {
        res.redirect('/admin/pages')
    }
})

router.post('/edit-page/:id', async function (req, res) {
    try{
        const id = req.params.id
        const title = req.body.title
        const slug = req.body.slug.replace(/\s+/g, '-').toLowerCase()
        const content = req.body.content
        const page = {}
        page.title = title
        page.slug = slug
        page.content = content

        await Page.findByIdAndUpdate(id, page, async function(err) {
            await Page.find(async function(err, pages) {
                if(err) {
                    return console.log(err)
                } else {
                    req.app.locals.pages = pages
                }
            })
            res.redirect('/admin/pages')
        })
    } catch(error) {
        res.redirect('/admin/pages')
    }
})

router.get('/delete-page/:id', isAdmin, async function (req, res) {
    const id = req.params.id
    await Page.findByIdAndRemove(id, async function(err) {
        if(err) {
            return console.log(err)
        }
        await Page.find(async function(err, pages) {
            if(err) {
                return console.log(err)
            } else {
                req.app.locals.pages = pages
            }
        })
        res.redirect('/admin/pages')
    })
})

module.exports = router