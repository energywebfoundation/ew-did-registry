[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ClaimsUser](claimsuser.md)

# Class: ClaimsUser

## Hierarchy

* [Claims](claims.md)

  ↳ **ClaimsUser**

## Implements

* [IClaims](../interfaces/iclaims.md)
* [IClaimsUser](../interfaces/iclaimsuser.md)

## Index

### Constructors

* [constructor](claimsuser.md#constructor)

### Properties

* [curve](claimsuser.md#curve)
* [did](claimsuser.md#did)
* [g](claimsuser.md#g)
* [jwt](claimsuser.md#jwt)
* [keys](claimsuser.md#keys)
* [paranoia](claimsuser.md#paranoia)
* [q](claimsuser.md#q)

### Methods

* [createPrivateClaim](claimsuser.md#createprivateclaim)
* [createProofClaim](claimsuser.md#createproofclaim)
* [createPublicClaim](claimsuser.md#createpublicclaim)
* [getDocument](claimsuser.md#getdocument)
* [verifyPrivateClaim](claimsuser.md#verifyprivateclaim)
* [verifyPublicClaim](claimsuser.md#verifypublicclaim)
* [verifySignature](claimsuser.md#verifysignature)

## Constructors

###  constructor

\+ **new ClaimsUser**(`keys`: IKeys, `resolver`: IResolver): *[ClaimsUser](claimsuser.md)*

*Inherited from [Claims](claims.md).[constructor](claims.md#constructor)*

Defined in claims/src/claims/claims.ts:28

**`constructor`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keys` | IKeys | user key pair |
`resolver` | IResolver |   |

**Returns:** *[ClaimsUser](claimsuser.md)*

## Properties

###  curve

• **curve**: *sjcl.SjclEllipticalCurve* =  sjcl.ecc.curves.k256

Defined in claims/src/claimsUser/claimsUser.ts:17

___

###  did

• **did**: *string*

*Implementation of [IClaims](../interfaces/iclaims.md).[did](../interfaces/iclaims.md#did)*

*Inherited from [Claims](claims.md).[did](claims.md#did)*

Defined in claims/src/claims/claims.ts:28

___

###  g

• **g**: *any* =  this.curve.G

Defined in claims/src/claimsUser/claimsUser.ts:21

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

___

###  paranoia

• **paranoia**: *number* = 6

Defined in claims/src/claimsUser/claimsUser.ts:23

___

###  q

• **q**: *any* =  this.curve.r

Defined in claims/src/claimsUser/claimsUser.ts:19

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md), `issuer`: string): *Promise‹object›*

*Implementation of [IClaimsUser](../interfaces/iclaimsuser.md)*

Defined in claims/src/claimsUser/claimsUser.ts:76

Used by the claim subject to create token with subject encrypted
private data which afterwards will be sent to the issuer. Salted private
fields will be saved in the `saltedFields` argument

**`example`** 
```typescript
import { ClaimsUser } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';

const user = new Keys();
const claims = new ClaimsUser(user);
const claimData = {
    secret: '123'
};
const claim = await claims.createPrivateClaim(claimData, issuer);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) | object with claim subject private data |
`issuer` | string |   |

**Returns:** *Promise‹object›*

> } token with private data encrypted by issuer key

___

###  createProofClaim

▸ **createProofClaim**(`claimUrl`: string, `saltedFields`: object): *Promise‹string›*

Defined in claims/src/claimsUser/claimsUser.ts:124

Used by the claim subject based on the salted values calculated
when creating private claim

**`example`** 
```typescript
import { ClaimsUser } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';

const user = new Keys();
const claims = new ClaimsUser(user);
const claimUrl = 'http://example.com';
const saltedFields = {
   secret: '123abc'
};
const claim = await claims.createProofClaim(claimUrl, saltedFields);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`claimUrl` | string | url of previously saved token |
`saltedFields` | object | - |

**Returns:** *Promise‹string›*

___

###  createPublicClaim

▸ **createPublicClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md)): *Promise‹string›*

*Implementation of [IClaimsUser](../interfaces/iclaimsuser.md)*

Defined in claims/src/claimsUser/claimsUser.ts:45

Creates token with data about subject provided in claimData

**`example`** 
```typescript
import { ClaimsUser } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';

const user = new Keys();
const claims = new ClaimsUser(user);
const claimData = {
    name: 'John'
};
const token = await claims.createPublicClaim(claimData);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) |   |

**Returns:** *Promise‹string›*

___

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

###  verifyPrivateClaim

▸ **verifyPrivateClaim**(`token`: string, `saltedFields`: object): *Promise‹boolean›*

Defined in claims/src/claimsUser/claimsUser.ts:185

Verifies token with private data received from issuer

**`example`** 
```typescript
import { ClaimsUser } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';

const user = new Keys();
const claims = new UserClaims(user);
const verified = await claims.verifyPrivateToken(issuedToken);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token` | string | issued token |
`saltedFields` | object | - |

**Returns:** *Promise‹boolean›*

___

###  verifyPublicClaim

▸ **verifyPublicClaim**(`token`: string): *Promise‹boolean›*

*Implementation of [IClaimsUser](../interfaces/iclaimsuser.md)*

Defined in claims/src/claimsUser/claimsUser.ts:164

Verifies token received from issuer

**`example`** 
```typescript
import { ClaimsUser } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';

const user = new Keys();
const claims = new UserClaims(user);
const verified = await claims.verifyPublicToken(issuedToken);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token` | string | issued token |

**Returns:** *Promise‹boolean›*

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
