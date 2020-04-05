## Keys Package
The keys package provides a clean and simple interface for the client and expose cryptographic operations based on asymmetric cryptography for secp256k1 ECDSA.
```typescript
// If you don't have a key pair you can generate new Key Pair
const keys = Keys.generateKeyPair(); // builder

// If you have a private key you can instantiate the Keys with private key
const keys = new Keys({ privateKey: keys.privateKey });

// If you have a public key you can Instantiate the Keys with public key
const keys = new Keys({ publicKey: keys.publicKey });

// Sign and verify data. 
const data = "test";
const signature = keys.sign(data); // Doesn't work if you initiate the Keys with public key.
console.log(keys.verify(data, signature)); // true
```