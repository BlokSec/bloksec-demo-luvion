
const BLOKSEC_HOST = process.env.BLOKSEC_HOST || 'http://localhost:3000';
const ISSUER = process.env.ISSUER || `${BLOKSEC_HOST}/oidc`;
const CLIENT_ID = process.env.CLIENT_ID || '7af3c5b2353d48e7838fb4e0cdabad85';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'c43f66d1a0584537b4f24791981478de';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const READ_TOKEN = process.env.READ_TOKEN || '80b9d9d7-ab13-4e7c-82dc-53c87affe065';
const WRITE_TOKEN = process.env.WRITE_TOKEN || '59ea3453-185c-4555-92cf-b2a487f50d3d';

console.info(`BASE_URL: '${BASE_URL}'`);
console.info(`BLOKSEC_HOST': '${BLOKSEC_HOST}'`);
console.info(`ISSUER: '${ISSUER}'`);
console.info(`CLIENT_ID: '${CLIENT_ID}'`);
console.info(`CLIENT_SECRET: '****${CLIENT_SECRET.substr(CLIENT_SECRET - 4, 4)}'`);


module.exports = {
  port: 8080,
  oidc: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    issuer: ISSUER,
    baseUrl: BASE_URL,
    apiHost: BLOKSEC_HOST,
    scope: 'openid email profile'
  },
  secrets: {
    readToken: READ_TOKEN,
    writeToken: WRITE_TOKEN,
  }
};

