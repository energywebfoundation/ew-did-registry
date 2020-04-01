const fs = require('fs');
const didAuth = require('@decentralized-identity/did-auth-jose');
const http = require('https');

const KEY_ID = 'key-1';

let privateJwk;
let publicJwk;

async function registerDid() {
  try {
    privateJwk = JSON.parse(fs.readFileSync('private.jwk', 'utf8'));
    privateJwk = didAuth.PrivateKeyRsa.wrapJwk(privateJwk.kid, privateJwk);
    publicJwk = privateJwk.getPublicKey();
  } catch (err) {

    // No private.jwk found
    privateJwk = await didAuth.PrivateKeyRsa.generatePrivateKey(KEY_ID);
    publicJwk = privateJwk.getPublicKey();
  }

  const body = {
    didMethod: 'test',
    hubUri: 'http://localhost:8080',
    publicKey: [publicJwk],
  };

  const cryptoFactory = new didAuth.CryptoFactory([new didAuth.RsaCryptoSuite()]);
  const token = new didAuth.JwsToken(JSON.stringify(body), cryptoFactory);
  const signedRegistrationRequest = await token.sign(privateJwk);

  // An object of options to indicate where to post to
  const postOtps = {
    host: 'beta.register.did.microsoft.com',
    path: '/api/v1.1',
    method: 'POST',
    headers: {
      'Content-Type': 'application/jwt',
      'Content-Length': Buffer.byteLength(signedRegistrationRequest)
    },
  };

  // Set up the request
  const postReq = http.request({ ...postOtps, rejectUnauthorized: false }, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(chunk);
      privateJwk.kid = `${JSON.parse(chunk).did}#${KEY_ID}`
      fs.writeFileSync('private.jwk', JSON.stringify(privateJwk), { encoding: 'utf8' });
    });
  });

  // post the data
  postReq.write(signedRegistrationRequest);
  postReq.end();
}

registerDid();
