[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Claims](claims.md)

# Class: Claims

## Hierarchy

* **Claims**

  ↳ [ClaimsIssuer](claimsissuer.md)

  ↳ [ClaimsVerifier](claimsverifier.md)

  ↳ [ClaimsUser](claimsuser.md)

## Implements

* [IClaims](../interfaces/iclaims.md)

## Index

### Constructors

* [constructor](claims.md#constructor)

### Properties

* [did](claims.md#did)
* [didDocument](claims.md#diddocument)
* [jwt](claims.md#jwt)
* [keys](claims.md#keys)
* [token](claims.md#token)

### Methods

* [getDocument](claims.md#getdocument)
* [verifySignature](claims.md#verifysignature)

## Constructors

###  constructor

\+ **new Claims**(`keys`: IKeys, `resolver`: IResolver): *[Claims](claims.md)*

Defined in claims/src/claims/claims.ts:39

Constructor

IClaimBuildData has to be passed to construct any type of Claim

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[Claims](claims.md)*

## Properties

###  did

• **did**: *string*

*Implementation of [IClaims](../interfaces/iclaims.md).[did](../interfaces/iclaims.md#did)*

Defined in claims/src/claims/claims.ts:39

___

###  didDocument

• **didDocument**: *IDIDDocument*

Defined in claims/src/claims/claims.ts:22

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

Defined in claims/src/claims/claims.ts:27

jwt stores the JWT to manage web tokens

___

###  keys

• **keys**: *IKeys*

*Implementation of [IClaims](../interfaces/iclaims.md).[keys](../interfaces/iclaims.md#keys)*

Defined in claims/src/claims/claims.ts:37

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

Defined in claims/src/claims/claims.ts:32

claimToken stores the actual serialised JWT in a string format

## Methods

###  getDocument

▸ **getDocument**(`did`: string): *Promise‹IDIDDocument›*

Defined in claims/src/claims/claims.ts:82

Method fetches the DID Document associated with did provided in claim data
DID Document is then stored as a member of Claim class. Returns true on success

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { Claim } from '@ew-did-registry/claims';

const keys = new Keys();
const jwt = new JWT(keys);
const claimData = {
  did: `did:ewc:0x${keys.publicKey}`,
  test: 'test',
};
const data = {
  jwt,
  keyPair: keys,
  claimData,
};
const publicClaim = new Claim(data);
await publicClaim.getDid();
console.log(publicClaim.didDocument);
```

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹IDIDDocument›*

___

###  verifySignature

▸ **verifySignature**(`token`: string, `signer`: string): *Promise‹boolean›*

Defined in claims/src/claims/claims.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`signer` | string |

**Returns:** *Promise‹boolean›*
