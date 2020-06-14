# Luvion

Luvion is a financial services mock website (name for the template on which it is based) configured to integrate with BlokSec to demonstrate the following use cases:
* Password-free / passwordless login
* Multi-Factor Authentication (MFA)
* Step-up / strong authorization when performing a transaction (BlokSec refers to this as "transaction consent")

## Configuration

The site uses a configuration file, [config.js](config.js). The config uses environment variables which can be either exported in the shell or stored in a file named `testenv` in this directory. See [dotenv](https://www.npmjs.com/package/dotenv) for more details on this file format. It may look something like:

```ini
# This is the location of the BlokSec instance to be used for consent API calls and will also be used to locate the BlokSec OpenID Connect IdP which will act as an issuer
BLOKSEC_HOST=https://<bloksecEnvironment>.bloksec.io

# These variables will be passed to the IdP to identify this OIDC client
CLIENT_ID=123XX
CLIENT_SECRET=456XX

```

## Running the demo
To run the demo, you will require NodeJS installed on your machine. Currently the app doesn't rely on any database or other external dependencies.
```bash
npm install
npm run dev
```

Then you can access the site by hitting [http://localhost:8080](http://localhost:8080)

