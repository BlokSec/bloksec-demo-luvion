/**
 * This file defines routes for the status / public pages of the site
 */
var express = require('express');
var router = express.Router();


router.get('/myaccountdetails.html', (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('myaccountdetails', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});

router.get('/mylandingpage.html', (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('mylandingpage', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});

router.get('/mytransferfunds.html', (req, res) => {
  const userinfo = req.userContext && req.userContext.userinfo;
  res.render('mytransferfunds', {
    isLoggedIn: !!userinfo,
    userinfo: userinfo
  });
});

module.exports = router;
