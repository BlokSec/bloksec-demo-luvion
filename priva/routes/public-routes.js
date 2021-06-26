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
const config = require('../config.js');

const log = log4js.getLogger('public-routes');
log.level = 'debug';

// configure passport.js to use the local strategy
passport.use(new LocalStrategy({
  usernameField: 'username'
}, (username, password, done) => {
  console.log(`${username}, ${password}`);
  if (!username) {
    return done(null, false, {
      message: 'Invalid credentials.'
    });
  }
  if (password !== 'password') {
    return done(null, false, {
      message: 'Invalid credentials.'
    });
  }
  return done(null, username);
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

router.get('/careers.html', (req, res) => {
  res.render('careers');
});

router.get('/why-choose-us.html', (req, res) => {
  res.render('why-choose-us');
});

router.get('/insurance-1.html', (req, res) => {
  res.render('insurance-1');
});

router.get('/insurance-2.html', (req, res) => {
  res.render('insurance-2');
});

router.get('/insurance-details-1.html', (req, res) => {
  res.render('insurance-details-1');
});

router.get('/insurance-details-2.html', (req, res) => {
  res.render('insurance-details-2');
});

router.get('/insurance-details-3.html', (req, res) => {
  res.render('insurance-details-3');
});

router.get('/insurance-details-4.html', (req, res) => {
  res.render('insurance-details-4');
});

router.get('/insurance-details-5.html', (req, res) => {
  res.render('insurance-details-5');
});

router.get('/insurance-details-6.html', (req, res) => {
  res.render('insurance-details-6');
});

router.get('/login-2.html', (req, res) => {
  res.render('login-2');
});

router.route('/login.html')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res, next) => {
    log.debug(`POST /login.html: ${util.inspect(req.body, false, null, true)}`);
    passport.authenticate('local', async (err, user, info) => {
      if (info) {
        log.debug(`passport authentication failed: ${util.inspect(info, false, 0, true)}`);
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
      log.debug(`passport authentication successful - user: ${user}`);
      req.session.uid = user;
      // Here we need to lookup the user to see if they have BlokSec MFA enabled - call the /account/:appId/:accountName to check
      var response;
      try {
        log.debug(`Calling PATCH ${config.oidc.apiHost}/account/${config.oidc.appDID}/${req.body.username}`);
        const data = {
          auth_token: config.secrets.writeToken,
        };
        response = await axios.patch(`${config.oidc.apiHost}/account/${config.oidc.appDID}/${req.body.username}`, data);
      } catch (error) {
        if (error.response.status == 404) {
          // user doesn't exist in BlokSec, just log them in
          log.info(`No BlokSec account exists for ${req.body.username}, logging them in and redirecting to the landing page`);
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            // Have to save the session manually because Express only invokes it at the end of an HTTP response (which doesn't happen with WebSockets)
            // See https://www.npmjs.com/package/express-session#sessionsavecallback
            req.session.save();
            return res.redirect('/imember.html');
          });
        } else {
          log.error(error.message);
          req.flash('info', error);
          req.session.save();
          return res.redirect('/login.html');
        }
      }
      if (response && response.data) {
        // User exists in BlokSec - render the MFA splash to force them through MFA
        log.info(`Found account: ${util.inspect(response.data, { showHidden: false, depth: null })}`);
        return res.render('mfasplash');
      }
    })(req, res, next);
  });

router.ws('/interaction/updates', async (ws, req, next) => {
  user = req.session.uid;
  try {
    console.log(`Sending BlokSec MFA request for ${user}`);

    try {
      const data = {
        appId: config.oidc.appDID,
        accountName: user,
        requestSummary: 'Luvion Authentication Request',
        requestDetails: `Please confirm that you are logging into Luvion as ${user}`,
        nonce: Date.now().toString()
      };

      const result = await axios.post(`${config.oidc.apiHost}/auth`, data);
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
            ws.send('/imember.html');
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

router.route(['/register.html'])
  .get((req, res) => {
    res.render('register');
  })
  // POST to registration need to call the BlokSec /registration API
  // Sample POST body:
  // {
  //   "auth_token": "59ea3453-185c-4555-92cf-b2a487f50d3d",
  //   "user": {
  //    "first_name": "Registration",
  //    "last_name": "User01",
  //    "email": "mike.gillan@gmail.com",
  //    "mobile_number": "+19055550000"
  //   },
  //   "account": {
  //     "name": "registration01@bloksec.com",
  //     "client": "5d9b7f4002d9220011fc6d40"
  //   }
  // }
  .post(async (req, res, next) => {
    log.debug(`POST /register:\n${util.inspect(req.body, false, null, true)}`);
    const nameSplit = parseName(req.body.name);

    const data = {
      auth_token: config.oidc.clientSecret,
      user: {
        first_name: nameSplit.firstName,
        last_name: nameSplit.lastName,
        email: req.body.email,
        mobile_number: req.body.mobile,
      },
      account: {
        name: req.body.username,
        appDID: config.oidc.appDID,
      },
    }

    log.debug(`Calling ${config.oidc.apiHost}/registration with data:\n${util.inspect(data, false, null, true)}`);
    const result = await axios.post(`${config.oidc.apiHost}/registration`, data);
    log.debug(`Result: ${result.status} - ${result.statusText}`);
    req.session.login_hint = req.body.username;
    res.render('login-2', {
      username: req.body.username
    });
  });

function parseName(input) {
  var fullName = input || "";
  var result = {};

  if (fullName.length > 0) {
    var nameTokens = fullName.match(/[A-ZÁ-ÚÑÜ][a-zá-úñü]+|([aeodlsz]+\s+)+[A-ZÁ-ÚÑÜ][a-zá-úñü]+/g) || [];

    if (nameTokens.length > 3) {
      result.firstName = nameTokens.slice(0, 2).join(' ');
    } else {
      result.firstName = nameTokens.slice(0, 1).join(' ');
    }

    if (nameTokens.length > 2) {
      result.lastName = nameTokens.slice(-2, -1).join(' ');
      result.secondLastName = nameTokens.slice(-1).join(' ');
    } else {
      result.lastName = nameTokens.slice(-1).join(' ');
      result.secondLastName = "";
    }
  }

  return result;
}

module.exports = router;
