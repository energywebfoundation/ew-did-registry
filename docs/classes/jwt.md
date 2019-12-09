[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [JWT](jwt.md)

# Class: JWT

## Hierarchy

* **JWT**

## Implements

* [IJWT](../interfaces/ijwt.md)

## Index

### Constructors

* [constructor](jwt.md#constructor)

### Methods

* [decode](jwt.md#decode)
* [sign](jwt.md#sign)
* [verify](jwt.md#verify)

## Constructors

###  constructor

\+ **new JWT**(`keyPair`: IKeys): *[JWT](jwt.md)*

*Defined in [jwt/src/index.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/1401544/packages/jwt/src/index.ts#L11)*

Key pair has to be passed on construction to JWT

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keyPair` | IKeys |   |

**Returns:** *[JWT](jwt.md)*

## Methods

###  decode

▸ **decode**(`token`: string, `options?`: object): *string | object*

*Implementation of [IJWT](../interfaces/ijwt.md)*

*Defined in [jwt/src/index.ts:129](https://github.com/energywebfoundation/ew-did-registry/blob/1401544/packages/jwt/src/index.ts#L129)*

Return decoded JWT payload without verifying signature

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

const AliceKeyPair = Keys.generateKeyPair();
const BobKeyPair = Keys.generateKeyPair();
const jwtAlice = new JWT(AliceKeyPair);
const jwtBob = new JWT(jwtBob);
const payload = {claim: 'test'};

const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });

const decoded = jwtBob.decode(token, {complete: true});
console.log(decoded.header);
console.log(decoded.payload.did);
```

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`options?` | object |

**Returns:** *string | object*

string | { [key: string]: any }

___

###  sign

▸ **sign**(`payload`: object, `options?`: object): *Promise‹string›*

*Implementation of [IJWT](../interfaces/ijwt.md)*

*Defined in [jwt/src/index.ts:47](https://github.com/energywebfoundation/ew-did-registry/blob/1401544/packages/jwt/src/index.ts#L47)*

Sign payload and return JWT

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

const keyPair = Keys.generateKeyPair();
const jwt = new JWT(keyPair);
const payload = {claim: 'test'};
let token;

try {
  token = await jwt.sign(payload, { algorithm: 'ES256' });
  console.log(token);
} catch(e) {
  console.log(e);
}
```

**Parameters:**

Name | Type |
------ | ------ |
`payload` | object |
`options?` | object |

**Returns:** *Promise‹string›*

___

###  verify

▸ **verify**(`token`: string, `publicKey`: string, `options?`: object): *Promise‹object›*

*Implementation of [IJWT](../interfaces/ijwt.md)*

*Defined in [jwt/src/index.ts:91](https://github.com/energywebfoundation/ew-did-registry/blob/1401544/packages/jwt/src/index.ts#L91)*

If the signature is correct, method returns decoded JWT payload

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

const AliceKeyPair = Keys.generateKeyPair();
const BobKeyPair = Keys.generateKeyPair();
const jwtAlice = new JWT(AliceKeyPair);
const jwtBob = new JWT(BobKeyPair);
const payload = {claim: 'test'};

const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });

let decoded;

try {
  decoded = await jwtBob.verify(token, AliceKeyPair.publicKey);
  console.log(decoded);
} catch(e) {
  console.log(e);
}
```

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`publicKey` | string |
`options?` | object |

**Returns:** *Promise‹object›*
