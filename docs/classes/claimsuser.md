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
* [didDocument](claimsuser.md#diddocument)
* [g](claimsuser.md#g)
* [jwt](claimsuser.md#jwt)
* [keys](claimsuser.md#keys)
* [paranoia](claimsuser.md#paranoia)
* [q](claimsuser.md#q)
* [token](claimsuser.md#token)

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

Defined in claims/src/claims/claims.ts:39

Constructor

IClaimBuildData has to be passed to construct any type of Claim

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

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

Defined in claims/src/claims/claims.ts:39

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claims](claims.md).[didDocument](claims.md#diddocument)*

Defined in claims/src/claims/claims.ts:22

didDocument is used to store fetched DID Document

___

###  g

• **g**: *any* =  this.curve.G

Defined in claims/src/claimsUser/claimsUser.ts:21

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

###  paranoia

• **paranoia**: *number* = 6

Defined in claims/src/claimsUser/claimsUser.ts:23

___

###  q

• **q**: *any* =  this.curve.r

Defined in claims/src/claimsUser/claimsUser.ts:19

___

###  token

• **token**: *string*

*Inherited from [Claims](claims.md).[token](claims.md#token)*

Defined in claims/src/claims/claims.ts:32

claimToken stores the actual serialised JWT in a string format

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md), `issuerPK`: string): *Promise‹object›*

*Implementation of [IClaimsUser](../interfaces/iclaimsuser.md)*

Defined in claims/src/claimsUser/claimsUser.ts:79

Used by the claim subject to create token with subject encrypted
private data which afterwards will be sent to the issuer. Salted private
fields will be saved in the `saltedFields` argument

**`example`** 
```typescript
import { Claims } from '@ew-did-registry/claims';
import { Networks } from '@ew-did-registry/did';

const subject = new Keys();
const claims = new Claims(subject);
const claimData = {
    did: 'did:Networks.Ethereum:claim_subject_address',
    secret: '123'
};
const issuerDid = 'did:Networks.Ethereum:issuer_address';
const claim = await claims.createPrivateClaim(claimData, issuerDid);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) | object with claim subject `did` and subject private data |
`issuerPK` | string | - |

**Returns:** *Promise‹object›*

claim wich contains token with private data encrypted by issuer key

___

###  createProofClaim

▸ **createProofClaim**(`claimUrl`: string, `saltedFields`: object): *Promise‹string›*

Defined in claims/src/claimsUser/claimsUser.ts:128

Used by the claim subject based on the hashed salted values calculated
when creating private claim. Verifier should use `generateClaimFromToken`

**`example`** 
```typescript
import { Claims } from '@ew-did-registry/claims';
import { Networks } from '@ew-did-registry/did';

const subject = new Keys();
const claims = new Claims(subject);
const claimData = {
    did: 'did:Networks.Ethereum:claim_subject_address',
};
const hashedFields = {
   secret: '0x500cec0cbd1888723f3438b2bdcb8b6b399cefefd25809231bed2c5bcb2aef88'
};
const claim = await claims.createProofClaim(claimData, hashedFields);
```

**Parameters:**

Name | Type |
------ | ------ |
`claimUrl` | string |
`saltedFields` | object |

**Returns:** *Promise‹string›*

___

###  createPublicClaim

▸ **createPublicClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md)): *Promise‹string›*

*Implementation of [IClaimsUser](../interfaces/iclaimsuser.md)*

Defined in claims/src/claimsUser/claimsUser.ts:46

Creates verifiable claim with data about subject provided in claimData

**`example`** 
```typescript
import { Claims } from '@ew-did-registry/claims';
import { Networks } from '@ew-did-registry/did';

const subject = new Keys();
const claims = new Claims(subject);
const claimData = {
    did: 'did:Networks.Ethereum:claim_subject_address',
    data: 'data'
};
const claim = await claims.createPublicClaim(claimData);
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

###  verifyPrivateClaim

▸ **verifyPrivateClaim**(`token`: string, `saltedFields`: object): *Promise‹boolean›*

Defined in claims/src/claimsUser/claimsUser.ts:185

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`saltedFields` | object |

**Returns:** *Promise‹boolean›*

___

###  verifyPublicClaim

▸ **verifyPublicClaim**(`token`: string): *Promise‹boolean›*

*Implementation of [IClaimsUser](../interfaces/iclaimsuser.md)*

Defined in claims/src/claimsUser/claimsUser.ts:179

Verify method checks if the token was signed by the correct private key
Returns true on success

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
const verified = await verificationClaim.verify();
console.log(verified) // Should be true, if successful
```

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
