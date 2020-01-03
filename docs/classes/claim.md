[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Claim](claim.md)

# Class: Claim

## Hierarchy

* **Claim**

  ↳ [VerificationClaim](verificationclaim.md)

## Implements

* [IClaim](../interfaces/iclaim.md)

## Index

### Constructors

* [constructor](claim.md#constructor)

### Properties

* [claimData](claim.md#claimdata)
* [didDocument](claim.md#diddocument)
* [jwt](claim.md#jwt)
* [keyPair](claim.md#keypair)
* [token](claim.md#token)

### Methods

* [getDid](claim.md#getdid)

## Constructors

###  constructor

\+ **new Claim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[Claim](claim.md)*

*Defined in [claims/src/public/claim.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L38)*

Constructor

Settings have to be passed to construct resolver

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimBuildData](../interfaces/iclaimbuilddata.md) |

**Returns:** *[Claim](claim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IClaim](../interfaces/iclaim.md).[claimData](../interfaces/iclaim.md#claimdata)*

*Defined in [claims/src/public/claim.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L33)*

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Defined in [claims/src/public/claim.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L18)*

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IClaim](../interfaces/iclaim.md).[jwt](../interfaces/iclaim.md#jwt)*

*Defined in [claims/src/public/claim.ts:23](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L23)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IClaim](../interfaces/iclaim.md).[keyPair](../interfaces/iclaim.md#keypair)*

*Defined in [claims/src/public/claim.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L38)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IClaim](../interfaces/iclaim.md).[token](../interfaces/iclaim.md#token)*

*Defined in [claims/src/public/claim.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L28)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Implementation of [IClaim](../interfaces/iclaim.md)*

*Defined in [claims/src/public/claim.ts:62](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L62)*

**Returns:** *Promise‹boolean›*
