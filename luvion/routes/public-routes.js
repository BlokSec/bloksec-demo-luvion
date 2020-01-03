/* eslint-disable brace-style */
/**
 * This file defines routes for the status / public pages of the site
 */
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const router = express.Router();
const { authenticateUser } = require('../src/bloksecAuthenticator');


// configure passport.js to use the local strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  console.log(`${email}, ${password}`);
  if (!email) {
    return done(null, false, { message: 'Invalid credentials.' });
  }
  if (password !== 'password') {
    return done(null, false, { message: 'Invalid credentials.' });
  }
  return done(null, email);
}));

router.use(flash());
     
// Index / home page route
router.get(['/', '/index.html'], (req, res) => {
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

router.get('/mfasplash.html', (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('mfasplash', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});

router.route(['/login.html'])
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
      if (info) {
        console.log(info);
        req.flash('info', info);
        return res.redirect('/login.html');
      }
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login.html'); }
      req.login(user, (err) => {
        if (err) { return next(err); }
        res.redirect('/mfasplash.html');
      });
    })(req, res, next);
  });

router.route(['/sign-up.html'])
  .get((req, res) => {
    res.render('sign-up');
  })
  .post((req, res, next) => {
    console.log(req.body);
    req.login(req.body.email, (err) => {
      if (err) { return next(err); }
      if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
      } else {
        res.redirect('/mylandingpage.html');
      }
    });
  });


module.exports = router;
