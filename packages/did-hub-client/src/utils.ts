import fetch, { Response } from 'node-fetch';
import { ec as EC } from 'elliptic';
import http from 'http';
import https from 'https';
import { DidPrivateKey } from './crypto';

const ec = new EC('secp256k1');

// const httpAgent = new http.Agent({
//   keepAlive: true,
// });
// const httpsAgent = new https.Agent({
//   keepAlive: true,
// });

// const options = {
//   agent: (_parsedURL) => {
//     if (_parsedURL.protocol === 'http:') {
//       return httpAgent;
//     }
//     return httpsAgent;
//   },
// };

// export const fetchWithHttp = (url: string): Promise<Response> => {
//   console.log('>>> fetching from ', url);
//   return fetch(url, options).then((value: Response) => {
//     console.log(`>>> fetched from ${url}:`, value);
//     return value;
//   });
// };

export const createJwkFromHex = (privateKey: string, keyId: string): DidPrivateKey => {
  const pubKey = ec.keyFromPrivate(privateKey).getPublic();
  return new DidPrivateKey({
    type: 'EcdsaSecp256k1VerificationKey2019', // 'EC'
    controller: '', // unknown before registration
    id: keyId,
    publicKeyJwk: {
      kid: keyId,
      d: Buffer.from(privateKey, 'hex').toString('base64'),
      crv: 'P-256K',
      x: pubKey.getX().toBuffer().toString('base64'),
      y: pubKey.getY().toBuffer().toString('base64'),
    },
  });
}