/* eslint-disable brace-style */
/**
 * This file defines routes for the status / public pages of the site
 */
const express = require('express');
const util = require('util');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const router = express.Router();
const axios = require('axios');
const log4js = require('log4js');
//const { authenticateUser } = require('../src/bloksecAuthenticator');
const config = require('../config.js');

const log = log4js.getLogger('public-routes');
log.level = 'debug';

// configure passport.js to use the local strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  console.log(`${email}, ${password}`);
  if (!email) {
    return done(null, false, {
      message: 'Invalid credentials.'
    });
  }
  if (password !== 'password') {
    return done(null, false, {
      message: 'Invalid credentials.'
    });
  }
  return done(null, email);
}));

router.use(flash());

// Index / home page route
router.get(['/', '/index.html'], (req, res) => {
  res.render('index');
});

router.get('/about.html', (req, res) => {
  res.render('about');
});

router.get('/contact.html', (req, res) => {
  res.render('contact');
});

router.get('/features-1.html', (req, res) => {
  res.render('features-1');
});

router.get('/features-2.html', (req, res) => {
  res.render('features-2');
});

router.route('/login.html')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res, next) => {
    log.debug(`POST /login.html: ${util.inspect(req.body, { showHidden: false, depth: null })}`);
    passport.authenticate('local', async (err, user, info) => {
      if (info) {
        log.debug(`passport authentication failed: ${info}`);
        req.flash('info', info);
        req.session.save();
        return res.redirect('/login.html');
      }
      if (err) {
        return next(err);
      }
      if (!user) {
        log.warn(`passport authentication failed: No user object returned `)
        return res.redirect('/login.html');
      }
      log.debug(`passpord authentication successful - user: ${user}`);
      req.session.uid = user;
      // Here we need to lookup the user to see if they have BlokSec MFA enabled - call the /account/:clientId/:accountName to check
      var response;
      try {
        log.debug(`Calling GET ${config.oidc.apiHost}/account/${config.oidc.clientId}/${req.body.email}`);
        const data = {
          auth_token: config.secrets.authToken,
        };
        response = await axios.patch(`${config.oidc.apiHost}/account/${config.oidc.clientId}/${req.body.email}`, data);
      } catch (error) {
        log.error(error);
        req.flash('info', error);
        req.session.save();
        return res.redirect('/login.html');
      }
      if (response && response.data) {
        // User exists in BlokSec - render the MFA splash to force them through MFA
        log.info(`Found account: ${util.inspect(response.data, { showHidden: false, depth: null })}`);
        res.render('mfasplash');
      } else {
        // user doesn't exist in BlokSec, just log them in
        log.info(`No BlokSec account exists for ${req.body.email}, logging them in and redirecting to the landing page`);
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          // Have to save the session manually because Express only invokes it at the end of an HTTP response (which doesn't happen with WebSockets)
          // See https://www.npmjs.com/package/express-session#sessionsavecallback
          req.session.save();
          res.redirect('/mylandingpage.html');
        });
      }
    })(req, res, next);
  });

router.ws('/interaction/updates', async (ws, req, next) => {
  user = req.session.uid;
  try {
    console.log(`Sending BlokSec MFA request for ${user}`);

    try {
      const data = {
        clientId: config.oidc.clientId,
        accountName: user,
        requestSummary: 'Luvion Authentication Request',
        requestDetails: `Please confirm that you are logging into Luvion as ${user}`,
        nonce: Date.now().toString()
      };

      const result = await axios.post('https://api.bloksec.io/auth', data);
      console.log(result.data);
      if (!result.data.returnValues) {
        throw 'Empty returnValues from BlokSec API'
      }

      console.log(result.data.returnValues);
      var authCode = result.data.returnValues.authCode;
      if (authCode === '1') {
        console.log('Login successful');
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          if (ws.readyState === ws.CLOSED) {
            // user navigated away or closed their browser, so the interaction will die here
            log.warn(`WS /interaction/updates ${user} > WebSocket session was already closed when authentication event was received, unable to send redirect`);
          } else {
            // Have to save the session manually because Express only invokes it at the end of an HTTP response (which doesn't happen with WebSockets)
            // See https://www.npmjs.com/package/express-session#sessionsavecallback
            req.session.save();
            ws.send('/mylandingpage.html');
            //ws.send(JSON.stringify(event));
          }
        });
      } else {
        console.log('Login was not successful: authCode = ' + authCode);
      }

    } catch (err) {
      console.log('Error encoutered while invoking the BlokSec API:');
      if (err.response) {
        // The request was made and the server responded with an error status code
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        if (err.response.status === 404) {
          req.flash('info', {
            message: 'Invalid credentials.'
          });
          req.session.save();
          ws.send('/login.html');
          return;
        } else {
          next(err);
        }
      } else {
        console.error(`Unhandled error: ${err}`);
        next(err);
      }
    }

    ws.on('close', () => {
      console.log(`WS /interaction/updates (${user}) > WebSocket has been closed`);
      // TODO: if this happens, interrupt the blockchainController because it doesn't need to keep watching
    });

  } catch (err) {
    console.error(`WS /interaction/updates (${user}) > ${util.inspect(err, { showHidden: false, depth: null })}`);
  }

});

router.route(['/sign-up.html'])
  .get((req, res) => {
    res.render('sign-up');
  })
  .post((req, res, next) => {
    console.log(req.body);
    req.login(req.body.email, (err) => {
      if (err) {
        return next(err);
      }
      if (req.session.returnTo) {
        req.session.save();
        res.redirect(req.session.returnTo);
      } else {
        req.session.save();
        res.redirect('/mylandingpage.html');
      }
    });
  });


module.exports = router;
