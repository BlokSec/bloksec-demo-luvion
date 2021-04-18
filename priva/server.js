/**
 * A simple web server that initializes the OIDC Middleware library with the
 * given options, and attaches route handlers for the example profile page
 * and logout functionality.
 */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const helmet = require('helmet');
const log4js = require('log4js');
const ExpressOIDC = require('./src/ExpressOIDC');
const config = require('./config.js');

const templateDir = path.join(__dirname, 'views');

const oidc = new ExpressOIDC(Object.assign({
  issuer: config.oidc.issuer,
  appDID: config.oidc.appDID,
  client_id: config.oidc.clientId,
  client_secret: config.oidc.clientSecret,
  appBaseUrl: config.oidc.appBaseUrl,
  scope: config.oidc.scope,
  testing: config.oidc.testing
}));

const app = express();
// eslint-disable-next-line no-unused-vars
const expressWs = require('express-ws')(app);

app.use(helmet());

// Setup the session, using cookies
app.use(session({
  key: 'user_sid',
  secret: 'Now is the time for all good people to come to the aid of the party.',
  resave: true,
  saveUninitialized: false,
}));

// If we are in production, use secure cookies and trust the proxy
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  //sessionConfig.cookie.secure = true; // serve secure cookies
}

// Body parser to read form-encoded posts
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
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
  nolog: ['\\/$', '^/css/.', '^/js/.', '^/images/.', '^/fonts/.'], // don't log request for images, css, etc. nor root requests (AWS healt check spams our logs)
}));

// Favicon middleware
// app.use(favicon(path.join(__dirname, 'assets', 'img', 'favicon.png')));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies && req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

// This server uses mustache templates located in views/ and public assets in assets/
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.set('view engine', 'ejs');
app.set('views', templateDir);

// setup the OIDC router to handle OpenID Connect client routes such as callbacks and logout requests
app.use(oidc.router);

oidc.on('ready', () => {
  app.listen(config.port, () => console.log(`App started on port ${config.port}`)); // eslint-disable-line no-console
});

oidc.on('error', err => {
  // An error occurred with OIDC
  log.error(`Could not connect to the OIDC provider at ${config.oidc.apiHost}, please ensure it is running and accessible`);
  throw err;
});

// Setup the routes to handle public and protected pages
const publicRouter = require('./routes/public-routes');
app.use(publicRouter);

const secureRouter = require('./routes/secure-routes');
app.use(secureRouter);

app.use((req, res) => {
  res.status(404).render('coming-soon');
});

