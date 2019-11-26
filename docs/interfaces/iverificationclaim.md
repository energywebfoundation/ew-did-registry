[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IVerificationClaim](iverificationclaim.md)

# Interface: IVerificationClaim

Verification Claim interface specifies methods to verify and approve claims
and is used by Private and Public Claims

## Hierarchy

* [IClaim](iclaim.md)

  ↳ **IVerificationClaim**

  ↳ [IPrivateClaim](iprivateclaim.md)

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

*Defined in [claims/src/models/index.ts:54](https://github.com/energywebfoundation/ew-did-registry/blob/2427e29/packages/claims/src/models/index.ts#L54)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaim](iclaim.md).[jwt](iclaim.md#jwt)*

*Defined in [claims/src/models/index.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/2427e29/packages/claims/src/models/index.ts#L46)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaim](iclaim.md).[keyPair](iclaim.md#keypair)*

*Defined in [claims/src/models/index.ts:58](https://github.com/energywebfoundation/ew-did-registry/blob/2427e29/packages/claims/src/models/index.ts#L58)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [IClaim](iclaim.md).[token](iclaim.md#token)*

*Defined in [claims/src/models/index.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/2427e29/packages/claims/src/models/index.ts#L50)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *string*

*Defined in [claims/src/models/index.ts:82](https://github.com/energywebfoundation/ew-did-registry/blob/2427e29/packages/claims/src/models/index.ts#L82)*

Method signs the claim and return the serialised JWT

**Returns:** *string*

___

###  getDid

▸ **getDid**(): *string*

*Inherited from [IClaim](iclaim.md).[getDid](iclaim.md#getdid)*

*Defined in [claims/src/models/index.ts:64](https://github.com/energywebfoundation/ew-did-registry/blob/2427e29/packages/claims/src/models/index.ts#L64)*

Method returns the DID document associated with a claim subject DID

**Returns:** *string*

___

###  verify

▸ **verify**(): *boolean*

*Defined in [claims/src/models/index.ts:76](https://github.com/energywebfoundation/ew-did-registry/blob/2427e29/packages/claims/src/models/index.ts#L76)*

verify check if the given Claim was signed correctly

**Returns:** *boolean*
