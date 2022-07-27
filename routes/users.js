const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req,res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req,res) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if(err) {return next(err)}
            req.flash('success', 'Welcome to blogSite!')
            res.redirect('/articles')
        })
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}));

router.get('/login', (req,res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req,res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/articles'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {return next(err)}
        req.flash('success', 'Goodbye!')
        res.redirect('/articles')
    })
})


module.exports = router