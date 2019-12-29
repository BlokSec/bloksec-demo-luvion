/**
 * A simple web server that initializes the OIDC Middleware library with the
 * given options, and attaches route handlers for the example profile page
 * and logout functionality.
 */

const express = require('express');
const session = require('express-session');
const https = require('https');
const http = require('http');
const favicon = require('serve-favicon');
const mustacheExpress = require('mustache-express');
const path = require('path');
const log4js = require('log4js');
const ExpressOIDC = require('./src/ExpressOIDC');
const config = require('./config.js');

const templateDir = path.join(__dirname, 'views');
const frontendDir = path.join(__dirname, 'assets');


const oidc = new ExpressOIDC(Object.assign({
  issuer: config.oidc.issuer,
  client_id: config.oidc.clientId,
  client_secret: config.oidc.clientSecret,
  appBaseUrl: config.oidc.appBaseUrl,
  scope: config.oidc.scope,
  testing: config.oidc.testing
}));

const app = express();

function setNoCache(req, res, next) {
  res.set('Pragma', 'no-cache');
  res.set('Cache-Control', 'no-cache, no-store');
  next();
}

app.use(session({
  secret: 'Now is the time for all good men to come to the aid of the party.',
  resave: true,
  saveUninitialized: false
}));

const log = log4js.getLogger('server');
log.level = 'debug';
// see https://github.com/log4js-node/log4js-node/blob/master/docs/connect-logger.md
app.use(log4js.connectLogger(log, {
  level: 'auto',
  statusRules: [
    { from: 200, to: 299, level: 'debug' },
    { codes: [302, 303, 304], level: 'info' },
  ],
  format: (req, res, format) => format(':remote-addr - ":method :url" :status :content-length :response-time ms'),
  nolog: ['\\/$', '^/assets/.'],
}));

app.use(favicon(path.join(__dirname, 'assets', 'img', 'favicon.png')));

// Provide the configuration to the view layer because we show it on the homepage
// TODO: remove the following displayConfig / oidcConfig stuff once we're not using it anymore
const displayConfig = Object.assign(
  {},
  config.oidc,
  {
    clientSecret: '****' + config.oidc.clientSecret.substr(config.oidc.clientSecret.length - 4, 4)
  }
);
app.locals.oidcConfig = displayConfig;

// This server uses mustache templates located in views/ and public assets in assets/
app.use('/assets', express.static(frontendDir));
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', templateDir);

app.use(oidc.router);

oidc.on('ready', () => {
  app.listen(config.port, () => console.log(`App started on port ${config.port}`)); // eslint-disable-line no-console
});

oidc.on('error', err => {
  // An error occurred with OIDC
  throw err;
});

// Setup the routes to handle public and private pages
const publicRouter = require('./routes/public-routes');
app.use(publicRouter);

app.use((req, res) => {
  res.status(404).render('error-404');
});


// ----------------------------------------------------------------
// TODO - remote the stuff below this line or move it if we need it
// ----------------------------------------------------------------
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

app.get('/registration_qr', setNoCache, (req, res) => {
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

app.get('/profile', oidc.ensureAuthenticated(), (req, res) => {
  // Convert the userinfo object into an attribute array, for rendering with mustache
  const userinfo = req.userContext && req.userContext.userinfo;
  const attributes = Object.entries(userinfo);
  res.render('profile', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo,
    attributes
  });
});

