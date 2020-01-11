[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IPrivateClaim](iprivateclaim.md)

# Interface: IPrivateClaim

This interface extends a more general Verification Claim interface
and specifies Private Claim interface, which is used to generate and
verify Private Claims

## Hierarchy

  ↳ [IVerificationClaim](iverificationclaim.md)

  ↳ **IPrivateClaim**

## Implemented by

* [PrivateClaim](../classes/privateclaim.md)

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

Defined in claims/src/models/index.ts:56

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaim](iclaim.md).[jwt](iclaim.md#jwt)*

Defined in claims/src/models/index.ts:48

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaim](iclaim.md).[keyPair](iclaim.md#keypair)*

Defined in claims/src/models/index.ts:60

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [IClaim](iclaim.md).[token](iclaim.md#token)*

Defined in claims/src/models/index.ts:52

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Inherited from [IVerificationClaim](iverificationclaim.md).[approve](iverificationclaim.md#approve)*

Defined in claims/src/models/index.ts:84

Method signs the claim and return the serialised JWT

**Returns:** *Promise‹string›*

___

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Inherited from [IClaim](iclaim.md).[getDid](iclaim.md#getdid)*

Defined in claims/src/models/index.ts:66

Method returns the DID document associated with a claim subject DID

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *Promise‹boolean›*

*Inherited from [IVerificationClaim](iverificationclaim.md).[verify](iverificationclaim.md#verify)*

Defined in claims/src/models/index.ts:78

verify check if the given Claim was signed correctly

**Returns:** *Promise‹boolean›*

___

###  verifyPayload

▸ **verifyPayload**(`hashedFields`: number[]): *boolean*

Defined in claims/src/private/interface.ts:20

To verify that the Issuer constructed the JWT correctly, hashed claim fields are provided

**Parameters:**

Name | Type |
------ | ------ |
`hashedFields` | number[] |

**Returns:** *boolean*
