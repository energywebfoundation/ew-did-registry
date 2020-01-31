# Keys User Guide

Keys Class can be used to sign/verify and encode/decode data using secp256k1 ellicptic curve.

* **Importing required modules**

``` typescript
   import { Keys } from '@ew-did-registry/keys';
```

* **Creating new Key Pair with a source of entropy**

``` typescript
    const keyPair = Keys.generateKeyPair();
```

* **Instantiating Keys Class instance to sign/verify/encode/decode data**

In the first case user provides the private key to instantiate the Key Class

``` typescript
    const keyPair = Keys.generateKeyPair();
    const keys = new Keys({ privateKey: keyPair.privateKey });
```

Keys can also be constructed with a private-public key pair.

``` typescript
    const keyPair = Keys.generateKeyPair();
    const keys = new Keys({
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });
```

Lastly, one can create keys with newly generated key pair.

``` typescript
    const keys = new Keys();
```

* **Signing and verifying the data with Keys Class**

``` typescript
    const keysAlice = new Keys();
    const keysBob = new Keys();
    const data = 'test';
    const signature = keysAlice.sign(data);
    const verified = keysBob.verify(data, signature, keysAlice.publicKey);
```

* **Encrypting and decrypting data**

``` typescript
    const keysAlice = new Keys();
    const keysBob = new Keys();
    const data = 'test';
    const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
    const decrypted = await keysBob.decrypt(encrypted);
```