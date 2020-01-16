[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IPrivateClaim](iprivateclaim.md)

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
* [createJWT](iprivateclaim.md#createjwt)
* [createPrivateClaimData](iprivateclaim.md#createprivateclaimdata)
* [decryptAndHashFields](iprivateclaim.md#decryptandhashfields)
* [getDid](iprivateclaim.md#getdid)
* [verify](iprivateclaim.md#verify)
* [verifyPayload](iprivateclaim.md#verifypayload)

## Properties

###  claimData

• **claimData**: *[IClaimData](iclaimdata.md)*

*Inherited from [IClaim](iclaim.md).[claimData](iclaim.md#claimdata)*

*Defined in [claims/src/models/index.ts:57](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L57)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaim](iclaim.md).[jwt](iclaim.md#jwt)*

*Defined in [claims/src/models/index.ts:49](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L49)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaim](iclaim.md).[keyPair](iclaim.md#keypair)*

*Defined in [claims/src/models/index.ts:61](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L61)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [IClaim](iclaim.md).[token](iclaim.md#token)*

*Defined in [claims/src/models/index.ts:53](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L53)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Inherited from [IVerificationClaim](iverificationclaim.md).[approve](iverificationclaim.md#approve)*

*Defined in [claims/src/models/index.ts:95](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L95)*

Method signs the claim and return the serialised JWT

**Returns:** *Promise‹string›*

___

###  createJWT

▸ **createJWT**(): *void*

*Inherited from [IClaim](iclaim.md).[createJWT](iclaim.md#createjwt)*

*Defined in [claims/src/models/index.ts:77](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L77)*

Method creates token with the payload provided in the claim data
The signed token is stored as a member of Claim class
This is a void method

**Returns:** *void*

___

###  createPrivateClaimData

▸ **createPrivateClaimData**(): *Promise‹[IClaimFields](iclaimfields.md)›*

*Defined in [claims/src/private/interface.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/private/interface.ts#L36)*

Method creates the salted and encrypted Private Claim Data required by the user
and sent to the issuer

**Returns:** *Promise‹[IClaimFields](iclaimfields.md)›*

___

###  decryptAndHashFields

▸ **decryptAndHashFields**(): *void*

*Defined in [claims/src/private/interface.ts:45](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/private/interface.ts#L45)*

Method is called by the issuer. It decrypts the claim data sent by user
and then encrypts again according to the protocol

**Returns:** *void*

___

###  getDid

▸ **getDid**(`did?`: string): *Promise‹boolean›*

*Inherited from [IClaim](iclaim.md).[getDid](iclaim.md#getdid)*

*Defined in [claims/src/models/index.ts:70](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L70)*

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

*Inherited from [IVerificationClaim](iverificationclaim.md).[verify](iverificationclaim.md#verify)*

*Defined in [claims/src/models/index.ts:89](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L89)*

verify check if the given Claim was signed correctly

**Returns:** *Promise‹boolean›*

___

###  verifyPayload

▸ **verifyPayload**(`hashedFields`: [IClaimFields](iclaimfields.md)): *boolean*

*Defined in [claims/src/private/interface.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/private/interface.ts#L28)*

To verify that the Issuer constructed the JWT correctly, hashed claim fields are provided

**Parameters:**

Name | Type |
------ | ------ |
`hashedFields` | [IClaimFields](iclaimfields.md) |

**Returns:** *boolean*
