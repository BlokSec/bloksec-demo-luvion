/**
 * This file defines routes for the status / public pages of the site
 */
const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router();

router.get('/myaccountdetails.html', ensureLoggedIn(), (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('myaccountdetails', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});

router.get('/mylandingpage.html', ensureLoggedIn(), (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('mylandingpage', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});

router.get('/mytransferfunds.html', ensureLoggedIn(), (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('mytransferfunds', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});

module.exports = router;
