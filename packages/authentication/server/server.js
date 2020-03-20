const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resolver, defaultResolverSettings } = require('@ew-did-registry/did-ethr-resolver');
const { DelegateTypes } = require('@ew-did-registry/did-resolver-interface');
const { Keys } = require('@ew-did-registry/keys');
const { Claims } = require('@ew-did-registry/claims');
const { JWT } = require('@ew-did-registry/jwt');

const app = express();
app.use(cors());
app.use(express.text());
// app.use(express.static(path.join(__dirname, '../client/build/index.html')));

app.post('/login', async function (req, res) {
  const token = req.body;
  const claim = new JWT().decode(token);
  console.log('>>> registration claim:', claim);
  const { exp, iss, sub, claimData: { network, uri, action, registry } } = claim;
  const resolver = new Resolver({ ...defaultResolverSettings, address: registry });
  const claims = new Claims(new Keys(), resolver);
  // TODO: extract method from DID and choose Resolver
  const verified = await claims.verifySignature(token, iss);
  console.log('verified:', verified);
  if (!verified) {
    res.json({ authenticated: false });
  }
  const owner = `did:${network}:${await resolver.identityOwner(sub)}`;
  const isDelegate = await resolver.validDelegate(sub, DelegateTypes.authentication, iss);
  const isOwner = iss === owner;
  const authenticated =
    !(new Date().getTime() / 1000 > exp) &&
    (uri === "https://origin.energyweb.org") &&/* will be real app uri */
    (action === 'login') &&
    (isOwner || isDelegate);
  res.json({ authenticated });
});

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
// })
const server = app.listen(3001, '127.0.0.1', () => { console.log('>>> server listening on', server.address().port) });