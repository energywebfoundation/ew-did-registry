[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [PrivateClaim](privateclaim.md)

# Class: PrivateClaim

## Hierarchy

  ↳ [VerificationClaim](verificationclaim.md)

  ↳ **PrivateClaim**

## Implements

* [IClaim](../interfaces/iclaim.md)
* [IVerificationClaim](../interfaces/iverificationclaim.md)
* [IPrivateClaim](../interfaces/iprivateclaim.md)

## Index

### Constructors

* [constructor](privateclaim.md#constructor)

### Properties

* [claimData](privateclaim.md#claimdata)
* [didDocument](privateclaim.md#diddocument)
* [jwt](privateclaim.md#jwt)
* [keyPair](privateclaim.md#keypair)
* [token](privateclaim.md#token)

### Methods

* [approve](privateclaim.md#approve)
* [createJWT](privateclaim.md#createjwt)
* [getDid](privateclaim.md#getdid)
* [verify](privateclaim.md#verify)
* [verifyPayload](privateclaim.md#verifypayload)

## Constructors

###  constructor

\+ **new PrivateClaim**(`data`: [IPrivateClaimBuildData](../interfaces/iprivateclaimbuilddata.md)): *[PrivateClaim](privateclaim.md)*

*Overrides [Claim](claim.md).[constructor](claim.md#constructor)*

Defined in claims/src/private/index.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IPrivateClaimBuildData](../interfaces/iprivateclaimbuilddata.md) |

**Returns:** *[PrivateClaim](privateclaim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[claimData](../interfaces/iprivateclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

Defined in claims/src/public/claim.ts:31

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claim](claim.md).[didDocument](claim.md#diddocument)*

Defined in claims/src/public/claim.ts:16

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[jwt](../interfaces/iprivateclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

Defined in claims/src/public/claim.ts:21

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[keyPair](../interfaces/iprivateclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

Defined in claims/src/public/claim.ts:36

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[token](../interfaces/iprivateclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

Defined in claims/src/public/claim.ts:26

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [VerificationClaim](verificationclaim.md).[approve](verificationclaim.md#approve)*

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

*Inherited from [Claim](claim.md).[createJWT](claim.md#createjwt)*

Defined in claims/src/public/claim.ts:135

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

▸ **getDid**(): *Promise‹boolean›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

Defined in claims/src/public/claim.ts:97

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

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *Promise‹boolean›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [VerificationClaim](verificationclaim.md).[verify](verificationclaim.md#verify)*

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

___

###  verifyPayload

▸ **verifyPayload**(`hashedFields`: number[]): *boolean*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

Defined in claims/src/private/index.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`hashedFields` | number[] |

**Returns:** *boolean*
