const User = require('../models/user');

module.exports.renderRegister = (req,res) => {
    res.render('users/register')
}

module.exports.register = async (req,res) => {
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
}

module.exports.renderLogin = (req,res) => {
    res.render('users/login')
}

module.exports.login = (req,res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/articles'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {return next(err)}
        req.flash('success', 'Goodbye!')
        res.redirect('/articles')
    })
}