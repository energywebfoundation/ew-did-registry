/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/camelcase */
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { DidCryptoSuite, DidPrivateKey } = require('@ew-did-registry/did-hub-client');

const Hub = require('@decentralized-identity/hub-node-core');
const hubMongo = require('@microsoft/hub-mongo-connector');
const didCommon = require('@decentralized-identity/did-common-typescript');
const didAuth = require('@decentralized-identity/did-auth-jose');

const universalResolverUrl = 'https://beta.discover.did.microsoft.com';
const mongoUrl = 'mongodb://localhost:27017';

async function runHub() {
  const app = express();
  const port = 8080;
  app.use(bodyParser.raw({
    inflate: true,
    limit: '500kb',
    type: 'application/jwt',
  }));

  // TODO: Register DID, provision & format keys, write to fs during npm setup

  const ecPrivJwk = {
    kty: 'EC',
    kid: 'did:test:cd4e18c0-94c9-4b77-977d-542093fb8e98#key-1',
    defaultEncryptionAlgorithm: 'ECIES',
    crv: 'P-256K',
    x: '0ZN1P2MXiNw2qUDqAhzPnFohj5koNMyvrDBKqvvClxE=',
    y: '0oyCg51hm9o3126ghtfYes3LoDwh8uQV9LeualAUNyQ=',
    key_ops: undefined,
    use: undefined,
    defaultSignAlgorithm: 'ES256K',
    d: 'qVMoTkgBB94luRVJjLVr+gRshw9W31gCG6G3IQIQEMw=',
  };

  const hubPrivateKey = {
    [ecPrivJwk.kid]: DidPrivateKey.wrapJwk(ecPrivJwk.kid, ecPrivJwk),
  };
  const hubCryptoSuites = [new didAuth.RsaCryptoSuite(), new DidCryptoSuite()];

  const mongoStore = new hubMongo.MongoDBStore({
    url: mongoUrl,
    databaseId: 'identity-hub',
    commitCollectionId: 'hub-commits',
    objectCollectionId: 'hub-objects',
  });

  await mongoStore.initialize();

  const hub = new Hub.default({
    store: mongoStore,
    resolver: new didCommon.HttpResolver({ fetch, resolverUrl: universalResolverUrl }),
    keys: hubPrivateKey,
    cryptoSuites: hubCryptoSuites
  });

  app.post('/', async (req, res) => {
    try {
      console.log('Hub request received');
      // process request body
      let requestBuffer;
      if (typeof req.body === 'string') {
        requestBuffer = Buffer.from(req.body);
      } else if (Buffer.isBuffer(req.body)) {
        requestBuffer = req.body;
      } else {
        return res.status(400).json({
          error_code: 'UNSUPPORTED_CONTENT_TYPE',
          error_url: null,
          developer_message: 'Expected a buffer or a string in HTTP request body.',
          inner_error: {
            timestamp: new Date(Date.now()).toUTCString(),
          },
        });
      }
      // pass hub request to Hub SDK
      const response = await hub.handleRequest(requestBuffer);

      // return hub response from SDK to client
      return res.status(response.ok ? 200 : 500).send(response.body);
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error has occurred while handling the hub request.');
    }
  });

  app.listen(port, () => console.log(`Identity hub running on port ${port}`));
}

runHub();
