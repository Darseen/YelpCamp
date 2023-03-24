const express = require('express');
const passport = require('passport');
const router = express.Router();
const users = require('../controllers/users');
const isLoggedIn = require('../utils/isLoggedin');
const wrapAsync = require('../utils/wrapAsync');

const passportConfig = {
    failureFlash: true,
    failureRedirect: '/login',
    keepSessionInfo: true
}

router.route('/register')
    .get(users.registerForm)
    .post(wrapAsync(users.register));

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', passportConfig), users.login);

router.post('/logout', isLoggedIn, users.logout);

module.exports = router;