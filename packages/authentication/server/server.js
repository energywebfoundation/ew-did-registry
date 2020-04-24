const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Resolver, defaultResolverSettings } = require('@ew-did-registry/did-ethr-resolver');
const { DelegateTypes } = require('@ew-did-registry/did-resolver-interface');
const { Keys } = require('@ew-did-registry/keys');
const { Claims } = require('@ew-did-registry/claims');
const { JWT } = require('@ew-did-registry/jwt');
const { Methods } = require('@ew-did-registry/did');

const secret = '123abc';

const app = express();
app.use(cors());
app.use(express.text());
app.use(function (req, res, next) {
  if (req.path === '/login') {
    return next();
  }
  let token = req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.redirect('http://localhost:3000/login');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.redirect('http://localhost:3000/login');
  }
});
app.get('/protected', async function (req, res) {
  res.json({ did: req.decoded.did });
});
app.post('/login', async function (req, res) {
  const token = req.body;
  const claim = new JWT().decode(token);
  const { iat, exp, iss, sub, claimData: { uri, action, registry } } = claim;
  const method = sub.split(':')[1];
  const resolver = getResolver(method, { registry });
  const claims = new Claims(new Keys(), resolver);
  const verified = await claims.verifySignature(token, iss);
  if (!verified) {
    res.json({ authenticated: false });
  }
  const owner = `did:${method}:${await resolver.identityOwner(sub)}`;
  const isDelegate = await resolver.validDelegate(sub, DelegateTypes.authentication, iss);
  const isOwner = iss === owner;
  const authenticated =
    !(new Date().getTime() / 1000 > exp) &&
    (uri === "https://origin.energyweb.org") &&
    (action === 'login') &&
    (isOwner || isDelegate);
  if (!authenticated) {
    return res.json({ authenticated });
  }
  res.json({
    authenticated: true, token: jwt.sign({ did: sub }, secret, { expiresIn: exp - iat })
  });
});

const server = app.listen(3001, '127.0.0.1', () => { console.log('>>> server listening on', server.address().port) });

const getResolver = (method, opts) => {
  switch (method) {
    case Methods.Erc1056:
      const { registry } = opts;
      return new Resolver({ ...defaultResolverSettings, address: registry });
    default:
      throw new Errow('Unknown DID method');
  }
}