
const BLOKSEC_HOST = process.env.BLOKSEC_HOST || 'http://localhost:3000';
const ISSUER = process.env.ISSUER || `${BLOKSEC_HOST}/oidc`;
const CLIENT_ID = process.env.CLIENT_ID || 'f935fdcd22f541abb684308fa3a679c5';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '03ee99faac974e259734f3832f3f85ae';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const DISABLEHTTPSCHECK = process.env.DISABLEHTTPSCHECK ? true : false;
const READ_TOKEN = process.env.READ_TOKEN || '80b9d9d7-ab13-4e7c-82dc-53c87affe065';
const WRITE_TOKEN = process.env.WRITE_TOKEN || '59ea3453-185c-4555-92cf-b2a487f50d3d';

console.info(`BASE_URL: '${BASE_URL}'`);
console.info(`BLOKSEC_HOST': '${BLOKSEC_HOST}'`);
console.info(`ISSUER: '${ISSUER}'`);
console.info(`CLIENT_ID: '${CLIENT_ID}'`);
console.info(`CLIENT_SECRET: '****${CLIENT_SECRET.substr(CLIENT_SECRET - 4, 4)}'`);
console.info(`READ_TOKEN: '${READ_TOKEN}'`);
console.info(`WRITE_TOKEN: '****${WRITE_TOKEN.substr(WRITE_TOKEN -4, 4)}'`);


module.exports = {
  port: 8080,
  oidc: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    issuer: ISSUER,
    appBaseUrl: BASE_URL,
    apiHost: BLOKSEC_HOST,
    scope: 'openid email profile',
    testing: {
      disableHttpsCheck: DISABLEHTTPSCHECK
    }
  },
  secrets: {
    readToken: READ_TOKEN,
    writeToken: WRITE_TOKEN,
  }
};
