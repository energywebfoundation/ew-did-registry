## JWT Package
The JWT package is internally consumed by the Claims package to perform necessary operations on JWTs.
```typescript
// Initiate the JWT implementation
const jwt = new IJWT(keyPair);

// Provide digitally signed JWT using ECDSA using P-256 curve and SHA-256 hash algorithm
// Various options can be specified, including Token expiration
// Returns encdoded token
try {
  const token = await jwt.sign(payload, { algorithm: 'ES256' });
} catch(e) {
  console.log(e);
}

// Siganture verification; options can be specified 
// Returns decoded payload, if signature is valid. Throws error otherwise
try {
  const decoded = await jwt.verify(token, publicKey);
} catch(e) {
  console.log(e);
}

// Decoding JWT without verifying the signature. This is require to retrieve DID of the subject
// Returns decoded object, which consists of header and payload
// If "complete" option is default(false), only payload is returned
// "json" options forces JSON.parse on the payload even if the header doesn't contain "typ":"JWT"
const decoded = jwt.decode(token, {complete: true});
console.log(decoded.header);
console.log(decoded.payload.did);
```