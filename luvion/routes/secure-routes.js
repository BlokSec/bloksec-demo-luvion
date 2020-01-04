/**
 * This file defines routes for the status / public pages of the site
 */
const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router();
const log4js = require('log4js');
const https = require('https');
const http = require('http');
const flash = require('express-flash');
const axios = require('axios');
const config = require('../config.js');
// Logging middleware
const log = log4js.getLogger('server');
log.level = 'debug';

router.use(flash());

router.get('/myaccountdetails.html', ensureLoggedIn('login.html'), (req, res) => {
  res.render('myaccountdetails');
});

router.get('/mylandingpage.html', ensureLoggedIn('login.html'), (req, res) => {
  res.render('mylandingpage');
});

router.route('/mytransferfunds.html')
  .get(ensureLoggedIn('login.html'), (req, res) => {
    res.render('mytransferfunds');
  })
  .post(ensureLoggedIn('login.html'), async (req, res, next) => {
    const transfer = req.body;
    log.debug(transfer);
    const email = (req.userContext.userinfo ? req.userContext.userinfo.email : req.userContext);
    log.debug(`User's email: ${email}`);
    try {
      const data = {
        clientId: config.oidc.clientId,
        accountName: email,
        requestSummary: 'Luvion Transfer Funds Request',
        requestDetails: `Confirm transfer of ${transfer.amount} ${transfer.currency} to ${transfer.recipient}?`,
        nonce: Date.now().toString()
      };
  
      const result = await axios.post('https://api.bloksec.io/auth', data);
      log.debug(result.data);
      if (!result.data.returnValues) {
        throw 'Empty returnValues from BlokSec API'
      }
  
      log.debug(result.data.returnValues);
      var authCode = result.data.returnValues.authCode;
      if (authCode === '1') {
        log.debug('Authorization successful');
        return res.redirect('/mylandingpage.html');
      } else {
        log.debug('Login was not successful: authCode = ' + authCode);
        req.flash('info', 'Transaction was not authorized');
        return res.redirect('/mytransferfunds.html');
      }
    } catch (err) {
      log.error('Error encoutered while invoking the BlokSec API:');
      if (err.response) {
        // The request was made and the server responded with an error status code
        log.error(err.response.data);
        log.error(err.response.status);
        log.error(err.response.headers);
        if (err.response.status === 404) {
          res.redirect('/login/?result=2');
          return;
        } else {
          next(err);
        }
      } else {
        log.error(`Unhandled error: ${err}`);
        next(err);
      }
    }
  });

// Used for parsing the QR code generation response from the BlokSec API server
function parseCode(code, res) {
  const { statusCode } = code;
  const contentType = code.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
  } else if (!/^image\/png/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
      `Expected image/png but received ${contentType}`);
  }
  if (error) {
    log.error(error.message);
    // Consume response data to free up memory
    res.status(500).send(error.message);
    return;
  }

  // https://github.com/Automattic/node-canvas/issues/138#issuecomment-194302434
  var chunks = [];
  code.on('data', function (chunk) {
    chunks.push(chunk);
  });

  code.on('end', function () {
    // https://github.com/expressjs/express/issues/732
    res.contentType('image/png');
    res.send(Buffer.concat(chunks));
  });
}

router.get('/registration_qr', (req, res) => {
  const { accountName } = req.query;
  const { issuer, clientId, apiHost } = config.oidc;
  const issuerURL = new URL(issuer);
  const location = issuerURL.protocol + '//' + issuerURL.host;
  try {
    if (issuerURL.protocol === 'https:') {
      https.get(`${location}/account/qr?clientId=${clientId}&accountName=${accountName}&address=${apiHost}`, (code) => {
        parseCode(code, res);
      });
    } else {
      http.get(`${location}/account/qr?clientId=${clientId}&accountName=${accountName}&address=${apiHost}`, (code) => {
        parseCode(code, res);
      });
    }
  } catch (error) {
    log.error(error);
  }
});

router.get('/passwordfree-setup.html', ensureLoggedIn('login.html'), (req, res) => {
  const email = (req.userContext.userinfo ? req.userContext.userinfo.email : req.userContext);
  log.debug(`User's email: ${email}`);
  res.render('passwordfree-setup', {
    email: email
  });
});

module.exports = router;
