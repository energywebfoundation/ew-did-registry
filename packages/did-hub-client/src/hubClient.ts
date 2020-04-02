/* eslint-disable @typescript-eslint/camelcase */
import * as DidAuth from '@decentralized-identity/did-auth-jose';
import * as HubSdk from '@decentralized-identity/hub-sdk-js';
import { HttpResolver } from '@decentralized-identity/did-common-typescript';
import DidDocument from '@decentralized-identity/did-common-typescript/dist/lib/DidDocument';
import { HubObjectQueryRequest, Commit } from '@decentralized-identity/hub-sdk-js';
import { IHubCommitQueryOptions, IHubObjectQueryOptions, IObjectMetadata } from '@decentralized-identity/hub-common-js';
import fetch from 'node-fetch';
import http from 'https';
import fs from 'fs';
import { DidPrivateKey, DidCryptoSuite, CommitSigner } from './crypto';
import { createJwkFromHex } from './utils';

const REG_KEY_ID = 'key-1';
const CLAIM_TYPE = 'Claim';

export class HubClient {
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
    // TODO if hubEndpoint is not provided try to fetch hubEndpoint from client document
    this.did = did;
    this.privJwk = createJwkFromHex(privateKey, REG_KEY_ID);
    this.privJwk.kid = `${this.did}#${REG_KEY_ID}`;
    this.resolver = new HttpResolver({ resolverUrl: 'https://beta.discover.did.microsoft.com/', fetch });
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

  async getDocument(did: string = this.did): Promise<DidDocument> {
    return (await this.resolver.resolve(did)).didDocument;
  }

  /**
   * Register new user and returns his DID in `test` method
   */
  static async register(
    privateKey: string, hubEndpoint: string,
  ): Promise<{ did: string; ecPrivJwk: DidPrivateKey }> {
    const ecPrivJwk = createJwkFromHex(privateKey, REG_KEY_ID);
    const body = {
      didMethod: 'test',
      hubUri: hubEndpoint,
      publicKey: [ecPrivJwk.getPublicKey()],
    };
    const cryptoFactory = new DidAuth.CryptoFactory([new DidCryptoSuite()]);
    const token = new DidAuth.JwsToken(JSON.stringify(body), cryptoFactory);
    const signedRegistrationRequest = await token.sign(ecPrivJwk);

    const postOptions = {
      host: 'beta.register.did.microsoft.com',
      path: '/api/v1.1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/jwt',
        'Content-Length': Buffer.byteLength(signedRegistrationRequest),
      },
    };

    return new Promise((resolve) => {
      const postReq = http.request({ ...postOptions, rejectUnauthorized: false }, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          const { did } = JSON.parse(chunk);
          ecPrivJwk.kid = `${did}#${REG_KEY_ID}`;
          fs.writeFileSync('private.jwk', JSON.stringify(ecPrivJwk), { encoding: 'utf8' });
          resolve({ did, ecPrivJwk });
        });
      });
      postReq.write(signedRegistrationRequest);
      postReq.end();
    });
  }

  private async getObjectIds(): Promise<string[]> {
    const queryOptions: IHubObjectQueryOptions = {
      interface: 'Collections',
      context: 'identity.foundation/schemas',
      type: CLAIM_TYPE,
    };

    const objects: IObjectMetadata[] = [];
    let response: HubSdk.HubObjectQueryResponse | undefined;

    do {
      const skipTokenField: any = response && response.hasSkipToken()
        ? { skip_token: response.getSkipToken() }
        : {};
      const request = new HubObjectQueryRequest(Object.assign(queryOptions, skipTokenField));
      // eslint-disable-next-line no-await-in-loop
      response = await this.session.send(request);
      objects.push(...response.getObjects());
    } while (response.hasSkipToken());

    const objectIds = objects.map(o => o.id);
    return objectIds;
  }

  /**
   * 
   * @param claim {string} stringified claim
   * @returns {string} created claim id
   */
  public async store(claim: string): Promise<string> {
    const response = await this.writeCommit(new HubSdk.Commit({
      protected: this.getStandardHeaders(),
      payload: {
        text: claim,
        done: false,
      },
    }));
    return response.getRevisions()[0]; // first revision is object id
  }

  private async writeCommit(commit: Commit): Promise<HubSdk.HubWriteResponse> {
    const signedCommit = await this.signer.sign(commit);
    const commitRequest = new HubSdk.HubWriteRequest(signedCommit);
    const commitResponse = await this.session.send(commitRequest);
    return commitResponse;
  }

  private getStandardHeaders(object_id?: string): object {
    return {
      committed_at: (new Date()).toISOString(),
      iss: this.did,
      sub: this.did,
      interface: 'Collections',
      context: 'identity.foundation/schemas',
      type: CLAIM_TYPE,
      operation: 'create',
      commit_strategy: 'basic',
      ...(object_id ? { object_id } : {}),
    };
  }

  /**
   * Fetches stringified claim
   * 
   * @param claimId {string} claim id returned from `store` method
   * @returns {string} claim
   */
  public async fetchClaim(claimId: string): Promise<string> {
    const claims = await this.fetchClaims();
    return claims.find((claim) => claim.claimId === claimId).claim;
  }

  public async fetchClaims(): Promise<Array<{ claimId: string; claim: string }>> {
    const objectIds = await this.getObjectIds();

    if (objectIds.length === 0) {
      return [];
    }

    const relevantCommits = await this.fetchAllCommitsRelatedToObjects(objectIds);

    const commitsByObject = this.groupCommitsByObjectId(relevantCommits);

    const strategy = new HubSdk.CommitStrategyBasic();
    const resolvedClaims = [];
    const commitsByObjectEntries = Object.entries(commitsByObject);

    for (let i = 0; i < commitsByObjectEntries.length; i += 1) {
      const [objectId, commits] = commitsByObjectEntries[i];
      // eslint-disable-next-line no-await-in-loop
      const resolvedObject = await strategy.resolveObject(commits);

      if (resolvedObject !== null) {
        resolvedClaims.push({
          claimId: objectId,
          claim: resolvedObject.text,
        });
      }
    }
    return resolvedClaims;
  }

  private async fetchAllCommitsRelatedToObjects(
    objectIds: string[],
  ): Promise<HubSdk.SignedCommit[]> {
    const queryOptions: IHubCommitQueryOptions = {
      object_id: objectIds,
    };

    const commits: HubSdk.SignedCommit[] = [];
    let response: HubSdk.HubCommitQueryResponse | undefined;

    do {
      const skipTokenField: any = response && response.hasSkipToken()
        ? { skip_token: response.getSkipToken() }
        : {};
      const request = new HubSdk.HubCommitQueryRequest(Object.assign(queryOptions, skipTokenField));
      // eslint-disable-next-line no-await-in-loop
      response = await this.session.send(request);
      commits.push(...response.getCommits());
    } while (response.hasSkipToken());

    return commits;
  }

  private groupCommitsByObjectId(
    commits: HubSdk.SignedCommit[],
  ): { [id: string]: HubSdk.SignedCommit[] } {
    const objects: { [id: string]: HubSdk.SignedCommit[] } = {};
    commits.forEach((commit) => {
      const commitObjectId = commit.getObjectId();
      const object = objects[commitObjectId];
      if (object) {
        object.push(commit);
      } else {
        objects[commitObjectId] = [commit];
      }
    });
    return objects;
  }
}
