[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaim](iclaim.md)

# Interface: IClaim

Claim interface is used by all Claim types

## Hierarchy

* **IClaim**

  ↳ [IVerificationClaim](iverificationclaim.md)

  ↳ [IProofClaim](iproofclaim.md)

## Implemented by

* [Claim](../classes/claim.md)
* [ProofClaim](../classes/proofclaim.md)
* [VerificationClaim](../classes/verificationclaim.md)

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

Defined in claims/src/models/index.ts:56

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

Defined in claims/src/models/index.ts:48

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

Defined in claims/src/models/index.ts:60

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

Defined in claims/src/models/index.ts:52

claimToken stores the actual serialised JWT in a string format

## Methods

###  getDid

▸ **getDid**(): *Promise‹boolean›*

Defined in claims/src/models/index.ts:66

Method returns the DID document associated with a claim subject DID

**Returns:** *Promise‹boolean›*
