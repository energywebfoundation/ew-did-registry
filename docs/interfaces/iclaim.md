[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaim](iclaim.md)

# Interface: IClaim

Claim interface is used by all Claim types

## Hierarchy

* **IClaim**

  ↳ [IVerificationClaim](iverificationclaim.md)

  ↳ [IProofClaim](iproofclaim.md)

## Index

### Properties

* [claimData](iclaim.md#claimdata)
* [jwt](iclaim.md#jwt)
* [keyPair](iclaim.md#keypair)
* [token](iclaim.md#token)

### Methods

* [getDid](iclaim.md#getdid)

## Properties

###  claimData

• **claimData**: *[IClaimData](iclaimdata.md)*

*Defined in [claims/src/models/index.ts:54](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L54)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Defined in [claims/src/models/index.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L46)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Defined in [claims/src/models/index.ts:58](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L58)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Defined in [claims/src/models/index.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L50)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  getDid

▸ **getDid**(): *string*

*Defined in [claims/src/models/index.ts:64](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L64)*

Method returns the DID document associated with a claim subject DID

**Returns:** *string*
