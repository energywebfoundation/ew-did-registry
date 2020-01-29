JWT md

# JWT User Guide

JWT class allows to sign, verify, and decode any valid JSON.

* **Importing required modules**

``` typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
```

* **Signing the payload by using Keys Class**

Algorithm parameter specifies signing algorithm.
No timestamp flag ensures that the payload stored in token is not assigned the timestamp.
Other relevant flags can be found in jsonwebtoken npm package.
``` typescript
    const keyPairAlice = new Keys(); 
    const jwtAlice = new JWT(keyPairAlice);
    payload = { claim: 'test' };
    token = await jwtAlice.sign(payload, { algorithm: 'ES256', noTimestamp: true });
```

* **Verifying the signature from above**

If the verification process is successful, then the method returns decoded payload of the jwt.
``` typescript
    const BobKeyPair = new Keys();
    const jwtBob = new JWT(BobKeyPair);
    const decoded = await jwtBob.verify(token, keyPairAlice.publicKey);
```

* **Decoding the token without verification**

Returns decoded payload, although signature is not checked
``` typescript
    const decodedWithoutVerification = jwtBob.decode(token);
```