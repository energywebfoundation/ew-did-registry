[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IProofClaim](iproofclaim.md)

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

* [getDid](iproofclaim.md#getdid)
* [verify](iproofclaim.md#verify)

## Properties

###  claimData

• **claimData**: *[IClaimData](iclaimdata.md)*

*Inherited from [IClaim](iclaim.md).[claimData](iclaim.md#claimdata)*

*Defined in [claims/src/models/index.ts:54](https://github.com/energywebfoundation/ew-did-registry/blob/dfdee88/packages/claims/src/models/index.ts#L54)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaim](iclaim.md).[jwt](iclaim.md#jwt)*

*Defined in [claims/src/models/index.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/dfdee88/packages/claims/src/models/index.ts#L46)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaim](iclaim.md).[keyPair](iclaim.md#keypair)*

*Defined in [claims/src/models/index.ts:58](https://github.com/energywebfoundation/ew-did-registry/blob/dfdee88/packages/claims/src/models/index.ts#L58)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Inherited from [IClaim](iclaim.md).[token](iclaim.md#token)*

*Defined in [claims/src/models/index.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/dfdee88/packages/claims/src/models/index.ts#L50)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  getDid

▸ **getDid**(): *string*

*Inherited from [IClaim](iclaim.md).[getDid](iclaim.md#getdid)*

*Defined in [claims/src/models/index.ts:64](https://github.com/energywebfoundation/ew-did-registry/blob/dfdee88/packages/claims/src/models/index.ts#L64)*

Method returns the DID document associated with a claim subject DID

**Returns:** *string*

___

###  verify

▸ **verify**(`privateToken`: string): *boolean*

*Defined in [claims/src/proof/interface.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/dfdee88/packages/claims/src/proof/interface.ts#L21)*

To verify the claim, private token (JWT) representing the claim should be provided

**Parameters:**

Name | Type |
------ | ------ |
`privateToken` | string |

**Returns:** *boolean*
