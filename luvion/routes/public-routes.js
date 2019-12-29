/**
 * This file defines routes for the status / public pages of the site
 */
var express = require('express')
var router = express.Router()

// Index / home page route
router.get(['/','/index.html'], (req, res) => {
    const userinfo = req.userContext && req.userContext.userinfo;
    res.render('index', {
        isLoggedIn: !!userinfo,
        userinfo: userinfo
    });
});

router.get('/about.html', (req, res) => {
    const userinfo = req.userContext && req.userContext.userinfo;
    res.render('about', {
        isLoggedIn: !!userinfo,
        userinfo: userinfo
    });
});

router.get('/contact.html', (req, res) => {
    const userinfo = req.userContext && req.userContext.userinfo;
    res.render('contact', {
        isLoggedIn: !!userinfo,
        userinfo: userinfo
    });
});

router.get('/features-1.html', (req, res) => {
    const userinfo = req.userContext && req.userContext.userinfo;
    res.render('features-1', {
        isLoggedIn: !!userinfo,
        userinfo: userinfo
    });
});

router.get('/features-2.html', (req, res) => {
    const userinfo = req.userContext && req.userContext.userinfo;
    res.render('features-2', {
        isLoggedIn: !!userinfo,
        userinfo: userinfo
    });
});

router.get('/login.html', (req, res) => {
    const userinfo = req.userContext && req.userContext.userinfo;
    res.render('login', {
        isLoggedIn: !!userinfo,
        userinfo: userinfo
    });
});

router.get('/sign-up.html', (req, res) => {
    const userinfo = req.userContext && req.userContext.userinfo;
    res.render('sign-up', {
        isLoggedIn: !!userinfo,
        userinfo: userinfo
    });
});


module.exports = router