/**
 * A simple web server that initializes the OIDC Middleware library with the
 * given options, and attaches route handlers for the example profile page
 * and logout functionality.
 */

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const {
  Issuer,
  Strategy
} = require('openid-client');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const helmet = require('helmet');
const log4js = require('log4js');
const config = require('./config.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const templateDir = path.join(__dirname, 'views');
const frontendDir = path.join(__dirname, 'assets');

const app = express();
app.use(helmet());

// Body parser to read form-encoded posts
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

// If we are in production, use secure cookies and trust the proxy
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

// Logging middleware
const log = log4js.getLogger('server');
log.level = 'debug';
// see https://github.com/log4js-node/log4js-node/blob/master/docs/connect-logger.md
app.use(log4js.connectLogger(log, {
  level: 'auto',
  statusRules: [{
      from: 200,
      to: 299,
      level: 'debug'
    },
    {
      codes: [302, 303, 304],
      level: 'info'
    },
  ],
  format: (req, res, format) => format(':remote-addr - ":method :url" :status :content-length :response-time ms'),
  nolog: ['^/assets/.'], // don't log request for images, css, etc. 
}));

// Favicon middleware
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));


// This server uses mustache templates located in views/ and public assets in assets/
app.use('/assets', express.static(frontendDir));
app.set('view engine', 'ejs');
app.set('views', templateDir);


Issuer.discover(config.oidc.issuer)
  .then(issuer => {
    const client = new issuer.Client({
      client_id: config.oidc.clientId,
      client_secret: config.oidc.clientSecret,
      redirect_uris: [`${config.oidc.baseUrl}/auth/callback`],
      post_logout_redirect_uris: [`${config.oidc.baseUrl}/logout/callback`],
      token_endpoint_auth_method: 'client_secret_post'
    });

    // Setup the session, using cookies
    app.use(
      session({
        secret: 'Now is the time for all good people to come to the aid of the party.',
        resave: false,
        saveUninitialized: true,
      })
    );

    app.use(passport.initialize({ userProperty: 'userContext' }));
    app.use(passport.session());

    // do the rest of setup here
    passport.use(
      'oidc',
      new Strategy({
        client
      }, (tokenSet, userinfo, done) => {
        log.debug('Received tokens %j', tokenSet);
        // log.debug('id_token: %j', tokenSet.id_token);
        log.debug('Validated ID token claims %j', tokenSet.claims());
        log.debug('userinfo %j', userinfo);
        return done(null, {
          userinfo: userinfo,
          tokens: tokenSet
        });
      })
    );

    // handles serialization and deserialization of authenticated user
    passport.serializeUser(function (user, done) {
      // log.debug('serialize %j', user);
      done(null, user);
    });
    passport.deserializeUser(function (user, done) {
      // log.debug('deserialize %j', user);
      done(null, user);
    });

    // start authentication request
    app.get('/auth', (req, res, next) => {
      passport.authenticate('oidc', {
        scope: config.oidc.scope
      })(req, res, next);
    });

    // authentication callback
    app.get('/auth/callback', (req, res, next) => {
      passport.authenticate('oidc', {
        successRedirect: '/users',
        failureRedirect: '/'
      })(req, res, next);
    });

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    // start logout request
    app.get('/logout', (req, res) => {
      if (!req.userContext || !req.userContext.tokens) {
        console.log('Logging user out');
        req.logout();
        return res.redirect('/');
      }
      log.debug(req.userConext);
      res.redirect(client.endSessionUrl({ id_token_hint: req.userContext.tokens.id_token }));
    });

    // logout callback
    app.get('/logout/callback', (req, res) => {
      // clears the persisted user from the local storage
      req.logout();
      // redirects the user to a public route
      res.redirect('/');
    });


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      log.error(err);
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'dev' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  });

app.listen(config.port, () => log.info(`App started on port ${config.port}`)); // eslint-disable-line no-console
