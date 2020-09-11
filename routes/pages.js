const router = require('express').Router()
const Page = require('../models/page')

router.get('/', function (req, res) {
    try {
        const user = res.locals.user
        if(user && user.admin == 1) {
            var admin = true
        }
        Page.find(function (err, pages) {    
            res.render('index.hbs', {
                title: 'Shop | Home',
                admin: admin,
                pages: pages
            })
        })
    } catch(error) {
        res.redirect('/')
    }
})

router.get('/:slug', function (req, res) {
    try {
        const slug = req.params.slug

        Page.find(function(err, pages) {
            Page.findOne({slug: slug}, function(err, page) {
                if(!page) {
                    res.redirect('/')
                } else {
                    res.render('pages.hbs', {
                        title: 'Shop | '+page.title,
                        page: page,
                        pages: pages
                    })
                }
            })
        })
    } catch(error) {
        res.redirect('/')
    }
})

module.exports = router