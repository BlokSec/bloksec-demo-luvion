/* eslint-disable brace-style */
/**
 * This file defines routes for the status / public pages of the site
 */
const express = require('express');
const session = require('express-session');
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

router.use(flash());

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

// Index / home page route
router.route(['/', 'index.html'])
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/mylandingpage.html')
    } else {
      res.render('index');
    }
  })
  // POST to registration need to call the BlokSec /registration API
  // Sample POST body:
  // {
  //   "auth_token": "59ea3453-185c-4555-92cf-b2a487f50d3d",
  //   "user": {
  //    "name": "Registration User01",
  //    "email": "mike.gillan@gmail.com",
  //    "mobile_number": "+19055550000"
  //   },
  //   "account": {
  //     "name": "registration01@bloksec.com",
  //     "client": "5d9b7f4002d9220011fc6d40"
  //   }
  // }
  .post(async (req, res, next) => {
    log.debug(req.body);

    const data = {
      auth_token: config.oidc.clientSecret,
      user: {
        name: req.body.name,
        email: req.body.email,
        mobile_number: req.body.mobile,
      },
      account: {
        name: req.body.email,

        appDID: config.oidc.appDID,
      },
    }

    log.debug(data);
    const result = await axios.post(`${config.oidc.apiHost}/registration`, data);
    log.debug(result);
    res.status(result.status);
    // res.send(result.statusText);
    res.render('signup-splash');
  });

router.get('/about.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('about', { isAuthenticated: req.isAuthenticated(), user: req.userContext });
  } else {
    res.render('about', { isAuthenticated: req.isAuthenticated() });
  }
});


router.get('/contact.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('contact', { isAuthenticated: req.isAuthenticated(), user: req.userContext });
  } else {
    res.render('contact', { isAuthenticated: req.isAuthenticated() });
  }
});

router.get('/men.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('men', { isAuthenticated: req.isAuthenticated(), user: req.userContext });
  } else {
    res.render('men', { isAuthenticated: req.isAuthenticated() });
  }
});

router.get('/women.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('women', { isAuthenticated: req.isAuthenticated(), user: req.userContext });
  } else {
    res.render('women', { isAuthenticated: req.isAuthenticated() });
  }
});

router.get('/boys.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('boys', { isAuthenticated: req.isAuthenticated(), user: req.userContext });
  } else {
    res.render('boys', { isAuthenticated: req.isAuthenticated() });
  }
});

router.get('/girls.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('girls', { isAuthenticated: req.isAuthenticated(), user: req.userContext });
  } else {
    res.render('girls', { isAuthenticated: req.isAuthenticated() });
  }
});

// router.ws('/interaction/updates', async (ws, req, next) => {
//   user = req.session.uid;
//   try {
//     console.log(`Sending BlokSec MFA request for ${user}`);

//     try {
//       const data = {
//         appDID: config.oidc.appDID,
//         accountName: user,
//         requestSummary: 'Fashion Hub Authentication Request',
//         requestDetails: `Please confirm that you are logging into Fashion Hub as ${user}`,
//         nonce: Date.now().toString()
//       };

//       const result = await axios.post(`${config.oidc.apiHost}/auth`, data);
//       console.log(result.data);
//       if (!result.data.returnValues) {
//         throw 'Empty returnValues from BlokSec API'
//       }

//       console.log(result.data.returnValues);
//       var authCode = result.data.returnValues.authCode;
//       if (authCode === '1') {
//         console.log('Login successful');
//         req.login(user, (err) => {
//           if (err) {
//             return next(err);
//           }
//           if (ws.readyState === ws.CLOSED) {
//             // user navigated away or closed their browser, so the interaction will die here
//             log.warn(`WS /interaction/updates ${user} > WebSocket session was already closed when authentication event was received, unable to send redirect`);
//           } else {
//             // Have to save the session manually because Express only invokes it at the end of an HTTP response (which doesn't happen with WebSockets)
//             // See https://www.npmjs.com/package/express-session#sessionsavecallback
//             req.session.save();
//             ws.send('/mylandingpage.html');
//             //ws.send(JSON.stringify(event));
//           }
//         });
//       } else {
//         console.log('Login was not successful: authCode = ' + authCode);
//       }

//     } catch (err) {
//       console.log('Error encoutered while invoking the BlokSec API:');
//       if (err.response) {
//         // The request was made and the server responded with an error status code
//         console.log(err.response.data);
//         console.log(err.response.status);
//         console.log(err.response.headers);
//         if (err.response.status === 404) {
//           req.flash('info', {
//             message: 'Invalid credentials.'
//           });
//           req.session.save();
//           ws.send('/login.html');
//           return;
//         } else {
//           next(err);
//         }
//       } else {
//         console.error(`Unhandled error: ${err}`);
//         next(err);
//       }
//     }

//     ws.on('close', () => {
//       console.log(`WS /interaction/updates (${user}) > WebSocket has been closed`);
//       // TODO: if this happens, interrupt the blockchainController because it doesn't need to keep watching
//     });

//   } catch (err) {
//     console.error(`WS /interaction/updates (${user}) > ${util.inspect(err, { showHidden: false, depth: null })}`);
//   }

// });

module.exports = router;
