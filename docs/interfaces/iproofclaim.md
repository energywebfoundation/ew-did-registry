[@ew-did-registry/did - v1.0.0](../README.md) › [Globals](../globals.md) › [IProofClaim](iproofclaim.md)

# Interface: IProofClaim

This interface extends a more general Claim interface
and specifies Proof interface, which is used to create
proof of knowledge of claim data and provides a method
to verify if the provided proof is valid

## Hierarchy

* [IClaim](iclaim.md)

  ↳ **IProofClaim**

## Index

### Properties

* [claimData](iproofclaim.md#claimdata)
* [jwt](iproofclaim.md#jwt)
* [keyPair](iproofclaim.md#keypair)
* [token](iproofclaim.md#token)

### Methods

* [createJWT](iproofclaim.md#createjwt)
* [getDid](iproofclaim.md#getdid)
* [verify](iproofclaim.md#verify)

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

▸ **verify**(`privateToken`: string): *boolean*

*Defined in [claims/src/proof/interface.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/proof/interface.ts#L21)*

To verify the claim, private token (JWT) representing the claim should be provided

**Parameters:**

Name | Type |
------ | ------ |
`privateToken` | string |

**Returns:** *boolean*
