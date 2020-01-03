/**
 * This file defines routes for the status / public pages of the site
 */
const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router();
const log4js = require('log4js');
const https = require('https');
const http = require('http');
const config = require('../config.js');
// Logging middleware
const log = log4js.getLogger('server');
log.level = 'debug';

router.get('/myaccountdetails.html', ensureLoggedIn('login.html'), (req, res) => {
  res.render('myaccountdetails');
});

router.get('/mylandingpage.html', ensureLoggedIn('login.html'), (req, res) => {
  res.render('mylandingpage');
});

router.get('/mytransferfunds.html', ensureLoggedIn('login.html'), (req, res) => {
  res.render('mytransferfunds');
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
