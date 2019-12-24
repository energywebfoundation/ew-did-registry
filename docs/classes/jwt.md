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

\+ **new JWT**(`keys`: IKeys): *[JWT](jwt.md)*

*Defined in [jwt/src/index.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/72b0e9b/packages/jwt/src/index.ts#L10)*

Key pair has to be passed on construction to JWT

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keys` | IKeys |   |

**Returns:** *[JWT](jwt.md)*

## Methods

###  decode

▸ **decode**(`token`: string, `options?`: object): *string | object*

*Implementation of [IJWT](../interfaces/ijwt.md)*

*Defined in [jwt/src/index.ts:128](https://github.com/energywebfoundation/ew-did-registry/blob/72b0e9b/packages/jwt/src/index.ts#L128)*

Return decoded JWT payload without verifying signature

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

const AliceKeyPair = new Keys();
const BobKeyPair = new Keys();
const jwtAlice = new JWT(AliceKeyPair);
const jwtBob = new JWT(BobKeyPair);
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

*Defined in [jwt/src/index.ts:45](https://github.com/energywebfoundation/ew-did-registry/blob/72b0e9b/packages/jwt/src/index.ts#L45)*

Sign payload and return JWT

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

const keyPair = new Keys();
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

*Defined in [jwt/src/index.ts:90](https://github.com/energywebfoundation/ew-did-registry/blob/72b0e9b/packages/jwt/src/index.ts#L90)*

If the signature is correct, method returns decoded JWT payload

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

const AliceKeyPair = new Keys();
const BobKeyPair = new Keys();
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
