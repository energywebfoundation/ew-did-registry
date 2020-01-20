[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IVerificationClaim](iverificationclaim.md)

# Interface: IVerificationClaim

Verification Claim interface specifies methods to verify and approve claims
and is used by Private and Public Claims

## Hierarchy

* [IClaim](iclaim.md)

  ↳ **IVerificationClaim**

  ↳ [IPrivateClaim](iprivateclaim.md)

## Implemented by

* [VerificationClaim](../classes/verificationclaim.md)

## Index

### Properties

* [claimData](iverificationclaim.md#claimdata)
* [jwt](iverificationclaim.md#jwt)
* [keyPair](iverificationclaim.md#keypair)
* [token](iverificationclaim.md#token)

### Methods

* [approve](iverificationclaim.md#approve)
* [getDid](iverificationclaim.md#getdid)
* [verify](iverificationclaim.md#verify)

## Properties

###  claimData

• **claimData**: *[IClaimData](iclaimdata.md)*

*Inherited from [IClaim](iclaim.md).[claimData](iclaim.md#claimdata)*

*Defined in [claims/src/models/index.ts:56](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/claims/src/models/index.ts#L56)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaim](iclaim.md).[jwt](iclaim.md#jwt)*

*Defined in [claims/src/models/index.ts:48](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/claims/src/models/index.ts#L48)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaim](iclaim.md).[keyPair](iclaim.md#keypair)*

*Defined in [claims/src/models/index.ts:60](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/claims/src/models/index.ts#L60)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [IClaim](iclaim.md).[token](iclaim.md#token)*

*Defined in [claims/src/models/index.ts:52](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/claims/src/models/index.ts#L52)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Defined in [claims/src/models/index.ts:84](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/claims/src/models/index.ts#L84)*

Method signs the claim and return the serialised JWT

**Returns:** *Promise‹string›*

___

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Inherited from [IClaim](iclaim.md).[getDid](iclaim.md#getdid)*

*Defined in [claims/src/models/index.ts:66](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/claims/src/models/index.ts#L66)*

Method returns the DID document associated with a claim subject DID

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *Promise‹boolean›*

*Defined in [claims/src/models/index.ts:78](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/claims/src/models/index.ts#L78)*

verify check if the given Claim was signed correctly

**Returns:** *Promise‹boolean›*
