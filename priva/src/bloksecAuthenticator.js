const axios = require('axios');
const config = require('../config.js');
/**
 * The authenticateUser method calls the BlokSec API and waits for the response to redirect
 * the user as appropriate based on the response
 * @param {*} req 
 * @param {*} res 
 */
const authenticateUser = async (req, res, next) => {

  try {
    const data = {
      appDID: config.oidc.appDID,
      accountName: req.userContext,
      requestSummary: 'Luvion Authentication Request',
      requestDetails: `Please confirm that you are attempting to log into Luvion with your account ${req.userContext}`,
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
      req.session.authenticated = true;
      if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
      } else {
        res.redirect('/mylandingpage.html');
      }
    } else {
      console.log('Login was not successful: authCode = ' + authCode);
      res.redirect('/login.html?result=' + authCode);
    }

  } catch (err) {
    console.log('Error encoutered while invoking the BlokSec API:');
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      if (err.response.status === 404) {
        res.redirect('/login/?result=2');
        return;
      } else {
        next(err);
      }
    } else {
      console.error(err);
      next(err);
    }
  }
}

module.exports = authenticateUser;
