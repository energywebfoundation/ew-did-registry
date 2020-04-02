/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/camelcase */
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { DidCryptoSuite, DidPrivateKey } = require('@ew-did-registry/did-hub-client');

const Hub = require('@decentralized-identity/hub-node-core');
const hubMongo = require('@microsoft/hub-mongo-connector');
const didCommon = require('@decentralized-identity/did-common-typescript');

const universalResolverUrl = 'https://beta.discover.did.microsoft.com';
const mongoUrl = 'mongodb://localhost:27017';

const app = express();
let server;
app.use(bodyParser.raw({
  inflate: true,
  limit: '500kb',
  type: 'application/jwt',
}));

async function runHub(ecPrivJwk, port) {
  const hubPrivateKey = {
    [ecPrivJwk.kid]: DidPrivateKey.wrapJwk(ecPrivJwk.kid, ecPrivJwk),
  };
  const hubCryptoSuites = [new DidCryptoSuite()];

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
    cryptoSuites: hubCryptoSuites,
  });

  app.post('/', async (req, res) => {
    try {
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
      const response = await hub.handleRequest(requestBuffer);
      return res.status(response.ok ? 200 : 500).send(response.body);
    } catch (error) {
      throw new Error('An unexpected error has occurred while handling the hub request.');
    }
  });
  server = app.listen(port, () => console.log(`Identity hub running on port ${port}`));
}

const shutdown = () => {
  if (server) {
    server.close();
  }
};

exports.runHub = runHub;
exports.shutdown = shutdown;
