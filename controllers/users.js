const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/');
        });

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back');
    let url = req.session.returnTo || '/campgrounds';
    url.includes('logout') ? url = '/campgrounds' : url = url;
    delete req.session.returnTo;
    res.redirect(url);
}

module.exports.logout = (req, res, next) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out');
        res.redirect('/');
    });
}