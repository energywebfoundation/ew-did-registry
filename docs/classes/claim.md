[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [Claim](claim.md)

# Class: Claim

## Hierarchy

* **Claim**

  ↳ [VerificationClaim](verificationclaim.md)

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

*Defined in [claims/src/public/claim.ts:41](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L41)*

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

*Defined in [claims/src/public/claim.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L36)*

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Defined in [claims/src/public/claim.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L21)*

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IClaim](../interfaces/iclaim.md).[jwt](../interfaces/iclaim.md#jwt)*

*Defined in [claims/src/public/claim.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L26)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IClaim](../interfaces/iclaim.md).[keyPair](../interfaces/iclaim.md#keypair)*

*Defined in [claims/src/public/claim.ts:41](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L41)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IClaim](../interfaces/iclaim.md).[token](../interfaces/iclaim.md#token)*

*Defined in [claims/src/public/claim.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L31)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  createJWT

▸ **createJWT**(): *Promise‹void›*

*Implementation of [IClaim](../interfaces/iclaim.md)*

*Defined in [claims/src/public/claim.ts:148](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L148)*

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

*Implementation of [IClaim](../interfaces/iclaim.md)*

*Defined in [claims/src/public/claim.ts:103](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/public/claim.ts#L103)*

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
