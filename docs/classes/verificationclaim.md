[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [VerificationClaim](verificationclaim.md)

# Class: VerificationClaim

## Hierarchy

* [Claim](claim.md)

  ↳ **VerificationClaim**

  ↳ [PrivateClaim](privateclaim.md)

## Implements

* [IClaim](../interfaces/iclaim.md)
* [IVerificationClaim](../interfaces/iverificationclaim.md)

## Index

### Constructors

* [constructor](verificationclaim.md#constructor)

### Properties

* [claimData](verificationclaim.md#claimdata)
* [didDocument](verificationclaim.md#diddocument)
* [jwt](verificationclaim.md#jwt)
* [keyPair](verificationclaim.md#keypair)
* [token](verificationclaim.md#token)

### Methods

* [approve](verificationclaim.md#approve)
* [createJWT](verificationclaim.md#createjwt)
* [getDid](verificationclaim.md#getdid)
* [verify](verificationclaim.md#verify)

## Constructors

###  constructor

\+ **new VerificationClaim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[VerificationClaim](verificationclaim.md)*

*Inherited from [Claim](claim.md).[constructor](claim.md#constructor)*

Defined in claims/src/public/claim.ts:41

Constructor

IClaimBuildData has to be passed to construct any type of Claim

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | [IClaimBuildData](../interfaces/iclaimbuilddata.md) |   |

**Returns:** *[VerificationClaim](verificationclaim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[claimData](../interfaces/iverificationclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

Defined in claims/src/public/claim.ts:36

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claim](claim.md).[didDocument](claim.md#diddocument)*

Defined in claims/src/public/claim.ts:21

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[jwt](../interfaces/iverificationclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

Defined in claims/src/public/claim.ts:26

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[keyPair](../interfaces/iverificationclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

Defined in claims/src/public/claim.ts:41

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[token](../interfaces/iverificationclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

Defined in claims/src/public/claim.ts:31

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

Defined in claims/src/public/verificationClaim.ts:70

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

**Returns:** *Promise‹string›*

___

###  createJWT

▸ **createJWT**(): *Promise‹void›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Inherited from [Claim](claim.md).[createJWT](claim.md#createjwt)*

Defined in claims/src/public/claim.ts:147

Method creates token with the payload provided in the claim data
The signed token is stored as a member of Claim class
This is a void method

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
await publicClaim.createJWT();
console.log(publicClaim.token);
```

**Returns:** *Promise‹void›*

___

###  getDid

▸ **getDid**(`did?`: string): *Promise‹boolean›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

Defined in claims/src/public/claim.ts:103

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
`did?` | string |

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *Promise‹boolean›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

Defined in claims/src/public/verificationClaim.ts:31

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

**Returns:** *Promise‹boolean›*
