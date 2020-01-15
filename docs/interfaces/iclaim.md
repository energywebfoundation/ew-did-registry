[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IClaim](iclaim.md)

# Interface: IClaim

Claim interface is used by all Claim types

## Hierarchy

* **IClaim**

  ↳ [IVerificationClaim](iverificationclaim.md)

  ↳ [IProofClaim](iproofclaim.md)

## Implemented by

* [Claim](../classes/claim.md)
* [PrivateClaim](../classes/privateclaim.md)
* [VerificationClaim](../classes/verificationclaim.md)

## Index

### Properties

* [claimData](iclaim.md#claimdata)
* [jwt](iclaim.md#jwt)
* [keyPair](iclaim.md#keypair)
* [token](iclaim.md#token)

### Methods

* [createJWT](iclaim.md#createjwt)
* [getDid](iclaim.md#getdid)

## Properties

###  claimData

• **claimData**: *[IClaimData](iclaimdata.md)*

*Defined in [claims/src/models/index.ts:57](https://github.com/energywebfoundation/ew-did-registry/blob/77ae9c7/packages/claims/src/models/index.ts#L57)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Defined in [claims/src/models/index.ts:49](https://github.com/energywebfoundation/ew-did-registry/blob/77ae9c7/packages/claims/src/models/index.ts#L49)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Defined in [claims/src/models/index.ts:61](https://github.com/energywebfoundation/ew-did-registry/blob/77ae9c7/packages/claims/src/models/index.ts#L61)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Defined in [claims/src/models/index.ts:53](https://github.com/energywebfoundation/ew-did-registry/blob/77ae9c7/packages/claims/src/models/index.ts#L53)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  createJWT

▸ **createJWT**(): *void*

*Defined in [claims/src/models/index.ts:77](https://github.com/energywebfoundation/ew-did-registry/blob/77ae9c7/packages/claims/src/models/index.ts#L77)*

Method creates token with the payload provided in the claim data
The signed token is stored as a member of Claim class
This is a void method

**Returns:** *void*

___

###  getDid

▸ **getDid**(`did?`: string): *Promise‹boolean›*

*Defined in [claims/src/models/index.ts:70](https://github.com/energywebfoundation/ew-did-registry/blob/77ae9c7/packages/claims/src/models/index.ts#L70)*

Method returns the DID document associated with a claim subject DID
Optional parameter did allows to read document associated with a different DID

**Parameters:**

Name | Type |
------ | ------ |
`did?` | string |

**Returns:** *Promise‹boolean›*
