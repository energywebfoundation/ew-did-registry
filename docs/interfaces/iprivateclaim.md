[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IPrivateClaim](iprivateclaim.md)

# Interface: IPrivateClaim

This interface extends a more general Verification Claim interface
and specifies Private Claim interface, which is used to generate and
verify Private Claims

## Hierarchy

  ↳ [IVerificationClaim](iverificationclaim.md)

  ↳ **IPrivateClaim**

## Index

### Properties

* [claimData](iprivateclaim.md#claimdata)
* [jwt](iprivateclaim.md#jwt)
* [keyPair](iprivateclaim.md#keypair)
* [token](iprivateclaim.md#token)

### Methods

* [approve](iprivateclaim.md#approve)
* [getDid](iprivateclaim.md#getdid)
* [verify](iprivateclaim.md#verify)
* [verifyPayload](iprivateclaim.md#verifypayload)

## Properties

###  claimData

• **claimData**: *[IClaimData](iclaimdata.md)*

*Inherited from [IClaim](iclaim.md).[claimData](iclaim.md#claimdata)*

*Defined in [claims/src/models/index.ts:54](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L54)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaim](iclaim.md).[jwt](iclaim.md#jwt)*

*Defined in [claims/src/models/index.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L46)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaim](iclaim.md).[keyPair](iclaim.md#keypair)*

*Defined in [claims/src/models/index.ts:58](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L58)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [IClaim](iclaim.md).[token](iclaim.md#token)*

*Defined in [claims/src/models/index.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L50)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *string*

*Inherited from [IVerificationClaim](iverificationclaim.md).[approve](iverificationclaim.md#approve)*

*Defined in [claims/src/models/index.ts:82](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L82)*

Method signs the claim and return the serialised JWT

**Returns:** *string*

___

###  getDid

▸ **getDid**(): *string*

*Inherited from [IClaim](iclaim.md).[getDid](iclaim.md#getdid)*

*Defined in [claims/src/models/index.ts:64](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L64)*

Method returns the DID document associated with a claim subject DID

**Returns:** *string*

___

###  verify

▸ **verify**(): *boolean*

*Inherited from [IVerificationClaim](iverificationclaim.md).[verify](iverificationclaim.md#verify)*

*Defined in [claims/src/models/index.ts:76](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/models/index.ts#L76)*

verify check if the given Claim was signed correctly

**Returns:** *boolean*

___

###  verifyPayload

▸ **verifyPayload**(`hashedFields`: number[]): *boolean*

*Defined in [claims/src/private/interface.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/809ce1c/packages/claims/src/private/interface.ts#L20)*

To verify that the Issuer constructed the JWT correctly, hashed claim fields are provided

**Parameters:**

Name | Type |
------ | ------ |
`hashedFields` | number[] |

**Returns:** *boolean*
