const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const authentication = function() {
    passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
        User.findOne({email: email}, async function (error, user) {
            if (error) {
                return done(error)
            }

            if (!user) {
                return done(null, false)
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false)
            }

            return done(null, user)
        })

    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    })
}

const isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/users/login')
    }
}

const isAdmin = function(req, res, next) {
    if (req.isAuthenticated() && res.locals.user.admin == 1) {
        next()
    } else {
        res.redirect('/users/login')
    }
}

module.exports = authentication()
module.exports = {isUser}
module.exports = {isAdmin}