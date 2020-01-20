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
* [jwt](claimsissuer.md#jwt)
* [keys](claimsissuer.md#keys)

### Methods

* [getDocument](claimsissuer.md#getdocument)
* [issuePrivateClaim](claimsissuer.md#issueprivateclaim)
* [issuePublicClaim](claimsissuer.md#issuepublicclaim)
* [verifySignature](claimsissuer.md#verifysignature)

## Constructors

###  constructor

\+ **new ClaimsIssuer**(`keys`: IKeys, `resolver`: IResolver): *[ClaimsIssuer](claimsissuer.md)*

*Inherited from [Claims](claims.md).[constructor](claims.md#constructor)*

Defined in claims/src/claims/claims.ts:28

**`constructor`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keys` | IKeys | user key pair |
`resolver` | IResolver |   |

**Returns:** *[ClaimsIssuer](claimsissuer.md)*

## Properties

###  did

• **did**: *string*

*Implementation of [IClaims](../interfaces/iclaims.md).[did](../interfaces/iclaims.md#did)*

*Inherited from [Claims](claims.md).[did](claims.md#did)*

Defined in claims/src/claims/claims.ts:28

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [Claims](claims.md).[jwt](claims.md#jwt)*

Defined in claims/src/claims/claims.ts:21

jwt stores the JWT to manage web tokens

___

###  keys

• **keys**: *IKeys*

*Implementation of [IClaims](../interfaces/iclaims.md).[keys](../interfaces/iclaims.md#keys)*

*Inherited from [Claims](claims.md).[keys](claims.md#keys)*

Defined in claims/src/claims/claims.ts:26

Key pair represents the implementation of key management interface

## Methods

###  getDocument

▸ **getDocument**(`did`: string): *Promise‹IDIDDocument›*

*Inherited from [Claims](claims.md).[getDocument](claims.md#getdocument)*

Defined in claims/src/claims/claims.ts:59

Fetches DID document of the corresponding DID

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { Claims } from '@ew-did-registry/claims';

const user = new Keys();
const claims = new Claims(user);
const did = `did:${Networks.Ethereum}:user_id`;
const document = await claims.getDocument(did);
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

Defined in claims/src/claimsIssuer/claimsIssuer.ts:56

Verifies user signature on token, decrypt private data and issue new token
with sha256-hashed decrypted data signed by issuer. Throws if user
signature not valid

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { ClaimsIssuer } from '@ew-did-registry/claims';

const issuer = new Keys();
claims = new ClaimsIssuer(issuer);
const issuedToken = await claims.issuePrivateClaim(token);
```

**`params`** { string } token to verify

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*

issued token

___

###  issuePublicClaim

▸ **issuePublicClaim**(`token`: string): *Promise‹string›*

*Implementation of [IClaimsIssuer](../interfaces/iclaimsissuer.md)*

Defined in claims/src/claimsIssuer/claimsIssuer.ts:29

Verifies user signature on token and issue new token signed by issuer./
Throws if user signature not valid

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { ClaimsIssuer } from '@ew-did-registry/claims';

const issuer = new Keys();
claims = new ClaimsIssuer(issuer);
const issuedToken = await claims.issuePublicClaim(token);
```

**`params`** { string } token to verify

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*

issued token

___

###  verifySignature

▸ **verifySignature**(`token`: string, `signer`: string): *Promise‹boolean›*

*Inherited from [Claims](claims.md).[verifySignature](claims.md#verifysignature)*

Defined in claims/src/claims/claims.ts:81

Verifies signers signature on received token

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { Claims } from '@ew-did-registry/claims';

const user = new Keys();
const claims = new Claims(user);
const verified = claims.verifySignature(token, userDid);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token` | string | token signature on which you want to check |
`signer` | string | did of the signer  |

**Returns:** *Promise‹boolean›*
