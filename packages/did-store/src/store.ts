import * as DidAuth from '@decentralized-identity/did-auth-jose';
import * as HubSdk from '@decentralized-identity/hub-sdk-js';
import { HttpResolver } from '@decentralized-identity/did-common-typescript';
import { HubObjectQueryRequest } from '@decentralized-identity/hub-sdk-js';
import fetch from 'node-fetch';
import { ec as EC } from 'elliptic';
import http from 'https';
import fs from 'fs';

const { EcPrivateKey } = DidAuth;
const ec = new EC('secp256k1');
const REG_KEY_ID = 'key-1';

export class DidStore {
  private did: string;

  private session: HubSdk.HubSession;

  constructor(did: string, privateKey: string, hubEndpoint: string) {
    this.did = did;
    this.session = new HubSdk.HubSession({
      clientDid: this.did,
      clientPrivateKey: DidStore.createJwkFromHex(privateKey, REG_KEY_ID),
      hubDid: this.did,
      hubEndpoint,
      resolver: new HttpResolver({ resolverUrl: 'https://beta.discover.did.microsoft.com/', fetch }),
      targetDid: this.did,
    });
  }

  async getObjectIds(): Promise<HubSdk.HubObjectQueryResponse> {
    return this.session.send(new HubObjectQueryRequest({
      interface: 'Collections',
      context: 'identity.foundation/schemas',
      type: 'Registration',
    }));
  }

  /**
   * Register new user and returns his DID in `test` method
   */
  static async register(privateKey: string, hubEndpoint: string): Promise<string> {
    const privJwk = DidStore.createJwkFromHex(privateKey, REG_KEY_ID);
    const body = {
      didMethod: 'test',
      hubUri: hubEndpoint,
      publicKey: [privJwk.getPublicKey()],
    };
    const cryptoFactory = new DidAuth.CryptoFactory([new DidAuth.Secp256k1CryptoSuite()]);
    const token = new DidAuth.JwsToken(JSON.stringify(body), cryptoFactory);
    const signedRegistrationRequest = await token.sign(privJwk);

    const postOptions = {
      host: 'beta.register.did.microsoft.com',
      path: '/api/v1.1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/jwt',
        'Content-Length': Buffer.byteLength(signedRegistrationRequest),
      },
    };

    return new Promise<string>((resolve) => {
      const postReq = http.request({ ...postOptions, rejectUnauthorized: false }, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          const { did, status } = JSON.parse(chunk);
          privJwk.kid = `${did}#${REG_KEY_ID}`;
          fs.writeFileSync('private.jwk', JSON.stringify(privJwk), { encoding: 'utf8' });
          resolve(did);
        });
      });
      postReq.write(signedRegistrationRequest);
      postReq.end();
    });
  }

  static createJwkFromHex(privateKey: string, keyId: string): DidAuth.EcPrivateKey {
    const pubKey = ec.keyFromPrivate(privateKey).getPublic();
    return new EcPrivateKey({
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
}
