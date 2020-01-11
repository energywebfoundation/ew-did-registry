[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Claim](claim.md)

# Class: Claim

## Hierarchy

* **Claim**

  ↳ [VerificationClaim](verificationclaim.md)

  ↳ [ProofClaim](proofclaim.md)

## Implements

* [IClaim](../interfaces/iclaim.md)

## Index

### Constructors

* [constructor](claim.md#constructor)

### Properties

* [claimData](claim.md#claimdata)
* [didDocument](claim.md#diddocument)
* [jwt](claim.md#jwt)
* [keyPair](claim.md#keypair)
* [token](claim.md#token)

### Methods

* [createJWT](claim.md#createjwt)
* [getDid](claim.md#getdid)

## Constructors

###  constructor

\+ **new Claim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[Claim](claim.md)*

Defined in claims/src/public/claim.ts:36

Constructor

IClaimBuildData has to be passed to construct any type of Claim

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | [IClaimBuildData](../interfaces/iclaimbuilddata.md) |   |

**Returns:** *[Claim](claim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IClaim](../interfaces/iclaim.md).[claimData](../interfaces/iclaim.md#claimdata)*

Defined in claims/src/public/claim.ts:31

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

Defined in claims/src/public/claim.ts:16

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IClaim](../interfaces/iclaim.md).[jwt](../interfaces/iclaim.md#jwt)*

Defined in claims/src/public/claim.ts:21

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IClaim](../interfaces/iclaim.md).[keyPair](../interfaces/iclaim.md#keypair)*

Defined in claims/src/public/claim.ts:36

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IClaim](../interfaces/iclaim.md).[token](../interfaces/iclaim.md#token)*

Defined in claims/src/public/claim.ts:26

claimToken stores the actual serialised JWT in a string format

## Methods

###  createJWT

▸ **createJWT**(): *Promise‹void›*

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

*Implementation of [IClaim](../interfaces/iclaim.md)*

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
