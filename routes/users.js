const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user')

router.get('/register', function (req, res) {
    try {
        res.render('register.hbs', {
            title: 'Register'
        })
    } catch(error) {
        res.redirect('/')
    }
})

router.post('/register', async function(req, res) {
    try {
        const name = req.body.name
        const email = req.body.email
        const username = req.body.username
        const password = req.body.password
        const user = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            admin: 0
        })
        await user.save()
        res.redirect('/')
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/login', function (req, res) {
    try {
        if(res.locals.user) {
            res.redirect('/')
        }
        res.render('login.hbs', {
            title: 'Login'
        })
    } catch(error) {
        res.redirect('/')
    }
})

router.post('/login', function (req, res, next) {
    try {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login'
        })(req, res, next)
    } catch(error) {
        res.redirect('/')
    }
})

router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})

module.exports = router