[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ClaimsIssuer](claimsissuer.md)

# Class: ClaimsIssuer

## Hierarchy

* [Claims](claims.md)

  ↳ **ClaimsIssuer**

## Implements

* [IClaims](../interfaces/iclaims.md)
* [IClaimsIssuer](../interfaces/iclaimsissuer.md)

## Index

### Constructors

* [constructor](claimsissuer.md#constructor)

### Properties

* [did](claimsissuer.md#did)
* [didDocument](claimsissuer.md#diddocument)
* [jwt](claimsissuer.md#jwt)
* [keys](claimsissuer.md#keys)
* [token](claimsissuer.md#token)

### Methods

* [getDocument](claimsissuer.md#getdocument)
* [issuePrivateClaim](claimsissuer.md#issueprivateclaim)
* [issuePublicClaim](claimsissuer.md#issuepublicclaim)
* [verifySignature](claimsissuer.md#verifysignature)

## Constructors

###  constructor

\+ **new ClaimsIssuer**(`keys`: IKeys, `resolver`: IResolver): *[ClaimsIssuer](claimsissuer.md)*

*Inherited from [Claims](claims.md).[constructor](claims.md#constructor)*

Defined in claims/src/claims/claims.ts:39

Constructor

IClaimBuildData has to be passed to construct any type of Claim

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[ClaimsIssuer](claimsissuer.md)*

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

###  issuePrivateClaim

▸ **issuePrivateClaim**(`token`: string): *Promise‹string›*

*Implementation of [IClaimsIssuer](../interfaces/iclaimsissuer.md)*

Defined in claims/src/claimsIssuer/claimsIssuer.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*

___

###  issuePublicClaim

▸ **issuePublicClaim**(`token`: string): *Promise‹string›*

*Implementation of [IClaimsIssuer](../interfaces/iclaimsissuer.md)*

Defined in claims/src/claimsIssuer/claimsIssuer.ts:41

Approve method signs the payload of the provided token with verifiers private key
Returns signed token on success

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { verificationClaim } from '@ew-did-registry/claims';

const keysVerifier = new Keys();
const jwtVerifier = new JWT(keysVerifier);
const tokenToVerify = publicClaim.token;
const dataVerifier = {
  jwt: jwtVerifier,
  keyPair: keysVerifier,
  token: tokenToVerify,
};

verificationClaim = new VerificationClaim(dataVerifier);
const approvedToken = await verificationClaim.approve();
console.log(approvedToken)
// If verification was successful, verifier can sign the payload of the token
// with his private key and return the approved JWT
```

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*

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
