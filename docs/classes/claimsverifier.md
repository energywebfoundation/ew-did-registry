[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ClaimsVerifier](claimsverifier.md)

# Class: ClaimsVerifier

## Hierarchy

* [Claims](claims.md)

  ↳ **ClaimsVerifier**

## Implements

* [IClaims](../interfaces/iclaims.md)
* [IClaimsVerifier](../interfaces/iclaimsverifier.md)

## Index

### Constructors

* [constructor](claimsverifier.md#constructor)

### Properties

* [did](claimsverifier.md#did)
* [didDocument](claimsverifier.md#diddocument)
* [jwt](claimsverifier.md#jwt)
* [keys](claimsverifier.md#keys)
* [token](claimsverifier.md#token)

### Methods

* [getDocument](claimsverifier.md#getdocument)
* [verifyPrivateProof](claimsverifier.md#verifyprivateproof)
* [verifyPublicProof](claimsverifier.md#verifypublicproof)
* [verifySignature](claimsverifier.md#verifysignature)

## Constructors

###  constructor

\+ **new ClaimsVerifier**(`keys`: IKeys, `resolver`: IResolver): *[ClaimsVerifier](claimsverifier.md)*

*Inherited from [Claims](claims.md).[constructor](claims.md#constructor)*

Defined in claims/src/claims/claims.ts:39

Constructor

IClaimBuildData has to be passed to construct any type of Claim

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[ClaimsVerifier](claimsverifier.md)*

## Properties

###  did

• **did**: *string*

*Implementation of [IClaims](../interfaces/iclaims.md).[did](../interfaces/iclaims.md#did)*

*Inherited from [Claims](claims.md).[did](claims.md#did)*

Defined in claims/src/claims/claims.ts:39

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claims](claims.md).[didDocument](claims.md#diddocument)*

Defined in claims/src/claims/claims.ts:22

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [Claims](claims.md).[jwt](claims.md#jwt)*

Defined in claims/src/claims/claims.ts:27

jwt stores the JWT to manage web tokens

___

###  keys

• **keys**: *IKeys*

*Implementation of [IClaims](../interfaces/iclaims.md).[keys](../interfaces/iclaims.md#keys)*

*Inherited from [Claims](claims.md).[keys](claims.md#keys)*

Defined in claims/src/claims/claims.ts:37

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [Claims](claims.md).[token](claims.md#token)*

Defined in claims/src/claims/claims.ts:32

claimToken stores the actual serialised JWT in a string format

## Methods

###  getDocument

▸ **getDocument**(`did`: string): *Promise‹IDIDDocument›*

*Inherited from [Claims](claims.md).[getDocument](claims.md#getdocument)*

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

###  verifyPrivateProof

▸ **verifyPrivateProof**(`proofToken`: string, `privateToken`: string): *boolean*

*Implementation of [IClaimsVerifier](../interfaces/iclaimsverifier.md)*

Defined in claims/src/claimsVerifier/claimsVerifier.ts:35

Сhecks that the public keys in the `privateToken`'s payload matches values
based on which `this.token` payload was calculated

**`example`** 
```typescript
import { ProofClaim } from '@ew-did-registry/claims';

------------------------------ owner -----------------------------------
const proofClaim = new ProofClaim({jwt, keys, claimData,  hashedFields });
const proofToken = proofClaim.token;
----------------------------- verifier ---------------------------------
const proofClaim = new ProofClaim({jwt, keys, claimData, proofToken });
const privateToken = store.getClaim(claimUrl);
const verified = proofClaim.verify(privateToken);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proofToken` | string | - |
`privateToken` | string |   |

**Returns:** *boolean*

___

###  verifyPublicProof

▸ **verifyPublicProof**(`token`: string): *Promise‹boolean›*

*Implementation of [IClaimsVerifier](../interfaces/iclaimsverifier.md)*

Defined in claims/src/claimsVerifier/claimsVerifier.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹boolean›*

___

###  verifySignature

▸ **verifySignature**(`token`: string, `signer`: string): *Promise‹boolean›*

*Inherited from [Claims](claims.md).[verifySignature](claims.md#verifysignature)*

Defined in claims/src/claims/claims.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`signer` | string |

**Returns:** *Promise‹boolean›*
