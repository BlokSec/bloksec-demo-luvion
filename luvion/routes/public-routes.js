/* eslint-disable brace-style */
/**
 * This file defines routes for the status / public pages of the site
 */
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const router = express.Router();


// configure passport.js to use the local strategy
// smh, the hack of it...
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  var user = {
    id: 123,
    email: email
  };
  console.log(`${email}, ${password}`);
  if (user.email !== 'test@test.com') {
    console.log('bad username');
    return done(null, false, { message: 'Invalid credentials.' });
  }
  if (password !== 'test') {
    console.log('bad password');
    return done(null, false, { message: 'Invalid credentials.' });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, {id: 123, email: 'test@test.com'});
});

router.use(passport.initialize());
router.use(passport.session());
router.use(flash());
     
// Index / home page route
router.get(['/', '/index.html'], (req, res) => {
  if (req.isAuthenticated()) {
    console.log('Logging user out');
    req.logout();
  }
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

router.route(['/login.html', '/login'])
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
      if (info) {
        console.log(info);
        req.flash('info', info);
        return res.redirect('/login');
      }
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.login(user, (err) => {
        if (err) { return next(err); }
        if (req.session.returnTo) {
          res.redirect(req.session.returnTo);
        } else {
          res.redirect('/mylandingpage.html');
        }
      });
    })(req, res, next);
  });


router.get('/sign-up.html', (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('sign-up', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});


module.exports = router;
