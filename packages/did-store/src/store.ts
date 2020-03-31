/* eslint-disable @typescript-eslint/camelcase */
import * as DidAuth from '@decentralized-identity/did-auth-jose';
import * as HubSdk from '@decentralized-identity/hub-sdk-js';
import { HttpResolver } from '@decentralized-identity/did-common-typescript';
import { HubObjectQueryRequest, Commit } from '@decentralized-identity/hub-sdk-js';
import fetch from 'node-fetch';
import http from 'https';
import fs from 'fs';
import DidDocument from '@decentralized-identity/did-common-typescript/dist/lib/DidDocument';
import { DidCryptoSuite } from './crypto/DidCryptoSuit';
import { CommitSigner } from './crypto/CommitSigner';
import { createJwkFromHex } from './utils';

const REG_KEY_ID = 'key-1';

export class DidStore {
  private did: string;

  private privJwk: DidAuth.PrivateKey;

  private resolver: HttpResolver;

  private session: HubSdk.HubSession;

  private signer: CommitSigner;

  /**
   *
   * @param did {string} - client DID
   * @param privateKey {string} - client private key in hex format
   * @param hubDid {string} - DID of the Hub Identity. Can be fetched from UserServiceEndpoint service point
   * @param hubEndpoint {string} - endpoint on which instance of Hub Identity is running
   * Can be retrived from client document's service points
   */
  constructor(did: string, privateKey: string, hubDid?: string, hubEndpoint?: string) {
    // TODO in abcense of hubEndpoint fetch it from client document
    this.did = did;
    this.privJwk = createJwkFromHex(privateKey, REG_KEY_ID);
    this.privJwk.kid = `${this.did}#${REG_KEY_ID}`;
    this.resolver = new HttpResolver({ resolverUrl: 'https://beta.discover.did.microsoft.com/', fetch });
    // console.log('>>> store priv key:', this.privJwk);
    this.session = new HubSdk.HubSession({
      cryptoSuites: [new DidCryptoSuite()],
      clientDid: this.did,
      clientPrivateKey: this.privJwk,
      hubDid,
      hubEndpoint,
      resolver: this.resolver,
      targetDid: this.did,
    });
    this.signer = new CommitSigner({
      did: this.did,
      key: this.privJwk,
      cryptoSuite: new DidCryptoSuite(),
    });
  }

  async getDocument(): Promise<DidDocument> {
    return (await this.resolver.resolve(this.did)).didDocument;
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
    const privJwk = createJwkFromHex(privateKey, REG_KEY_ID);
    // console.log('>>> reg priv key:', privJwk);
    const body = {
      didMethod: 'test',
      hubUri: hubEndpoint,
      publicKey: [privJwk.getPublicKey()],
    };
    const cryptoFactory = new DidAuth.CryptoFactory([new DidCryptoSuite()]);
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

  public async store(payload: string): Promise<string> {
    const response = await this.writeCommit(new HubSdk.Commit({
      protected: this.getStandardHeaders('create'),
      payload: {
        text: payload,
        done: false,
      },
    }));
    return response.getRevisions()[0];
  }

  private async writeCommit(commit: Commit): Promise<HubSdk.HubWriteResponse> {
    const signedCommit = await this.signer.sign(commit);
    const commitRequest = new HubSdk.HubWriteRequest(signedCommit);
    const commitResponse = await this.session.send(commitRequest);
    console.log(commitResponse);
    return commitResponse;
  }

  private getStandardHeaders(operation: 'create' | 'update' | 'delete', object_id?: string): object {
    return {
      committed_at: (new Date()).toISOString(),
      iss: this.did,
      sub: this.did,
      interface: 'Collections',
      context: 'identity.foundation/schemas',
      type: 'Registration',
      operation,
      commit_strategy: 'basic',
      ...(object_id ? { object_id } : {}),
    };
  }
}
