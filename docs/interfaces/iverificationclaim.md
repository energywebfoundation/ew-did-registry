[@ew-did-registry/did - v1.0.0](../README.md) › [Globals](../globals.md) › [IVerificationClaim](iverificationclaim.md)

# Interface: IVerificationClaim

Verification Claim interface specifies methods to verify and approve claims
and is used by Private and Public Claims

## Hierarchy

* [IClaim](iclaim.md)

  ↳ **IVerificationClaim**

  ↳ [IPrivateClaim](iprivateclaim.md)

## Implemented by

* [PrivateClaim](../classes/privateclaim.md)
* [VerificationClaim](../classes/verificationclaim.md)

## Index

### Properties

* [claimData](iverificationclaim.md#claimdata)
* [jwt](iverificationclaim.md#jwt)
* [keyPair](iverificationclaim.md#keypair)
* [token](iverificationclaim.md#token)

### Methods

* [approve](iverificationclaim.md#approve)
* [createJWT](iverificationclaim.md#createjwt)
* [getDid](iverificationclaim.md#getdid)
* [verify](iverificationclaim.md#verify)

## Properties

###  claimData

• **claimData**: *[IClaimData](iclaimdata.md)*

*Inherited from [IClaim](iclaim.md).[claimData](iclaim.md#claimdata)*

*Defined in [claims/src/models/index.ts:57](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L57)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaim](iclaim.md).[jwt](iclaim.md#jwt)*

*Defined in [claims/src/models/index.ts:49](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L49)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaim](iclaim.md).[keyPair](iclaim.md#keypair)*

*Defined in [claims/src/models/index.ts:61](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L61)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [IClaim](iclaim.md).[token](iclaim.md#token)*

*Defined in [claims/src/models/index.ts:53](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L53)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Defined in [claims/src/models/index.ts:95](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L95)*

Method signs the claim and return the serialised JWT

**Returns:** *Promise‹string›*

___

###  createJWT

▸ **createJWT**(): *void*

*Inherited from [IClaim](iclaim.md).[createJWT](iclaim.md#createjwt)*

*Defined in [claims/src/models/index.ts:77](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L77)*

Method creates token with the payload provided in the claim data
The signed token is stored as a member of Claim class
This is a void method

**Returns:** *void*

___

###  getDid

▸ **getDid**(`did?`: string): *Promise‹boolean›*

*Inherited from [IClaim](iclaim.md).[getDid](iclaim.md#getdid)*

*Defined in [claims/src/models/index.ts:70](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L70)*

Method returns the DID document associated with a claim subject DID
Optional parameter did allows to read document associated with a different DID

**Parameters:**

Name | Type |
------ | ------ |
`did?` | string |

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *Promise‹boolean›*

*Defined in [claims/src/models/index.ts:89](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L89)*

verify check if the given Claim was signed correctly

**Returns:** *Promise‹boolean›*
