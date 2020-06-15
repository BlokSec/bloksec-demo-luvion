var express = require('express');
var router = express.Router();
const util = require('util');
const flash = require('express-flash');
const axios = require('axios');
const log4js = require('log4js');
const config = require('../config.js');

const log = log4js.getLogger('public-routes');
log.level = 'debug';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route(['/sign-up.html'])
  .get((req, res) => {
    res.render('sign-up');
  })
 
  .post(async (req, res, next) => {
    log.debug(req.body);

    const data = {
      auth_token: config.secrets.writeToken,
      user: {
        name: `${req.body.firstName} ${req.body.lastName}`,
        email: req.body.email,
        mobile_number: req.body.mobile,
      },
      account: {
        name: req.body.username,
        appId: config.oidc.clientId,
      },
    }

    log.debug(data);
    const result = await axios.post(`${config.oidc.apiHost}/registration`, data);
    log.debug(result);
    res.render('sign-upsplash', {
      username: req.body.username
    });
  });



module.exports = router;
