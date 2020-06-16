# BlokSec Demo - *oidc-basic*

This project is a simple demonstration of integrating with the BlokSec OIDC identity provider (IdP) using the oidc-client middleware. The demo is based on an [example found on codeburst.io](https://codeburst.io/how-to-implement-openid-authentication-with-openid-client-and-passport-in-node-js-43d020121e87), adding in configuration for BlokSec (see [config.js](config.js)) and a call to the registration API (see [routes/index.js](routes/index.js))

Please note that in order to execute the examples, you will need to have the [BlokSec application](https://apps.apple.com/ca/app/bloksec/id1462338006) installed on your **iOS** mobile device.

*(2020/06/16 - Please note that Android is not currently supported, but support will be added in the coming weeks)*

## Installation
```bash
npm install
```

## Running the demo
```bash
npm run start
``` 

Then access [http://localhost:8080](http://localhost:8080)

### Releases

#### Version 1.0.0 - Initial Release
* Implements login via OIDC and registration via the BlokSec API
