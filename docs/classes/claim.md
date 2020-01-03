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

* [createJWT](claim.md#createjwt)
* [getDid](claim.md#getdid)

## Constructors

###  constructor

\+ **new Claim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[Claim](claim.md)*

*Defined in [claims/src/public/claim.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L36)*

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

*Defined in [claims/src/public/claim.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L31)*

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Defined in [claims/src/public/claim.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L16)*

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IClaim](../interfaces/iclaim.md).[jwt](../interfaces/iclaim.md#jwt)*

*Defined in [claims/src/public/claim.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L21)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IClaim](../interfaces/iclaim.md).[keyPair](../interfaces/iclaim.md#keypair)*

*Defined in [claims/src/public/claim.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L36)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IClaim](../interfaces/iclaim.md).[token](../interfaces/iclaim.md#token)*

*Defined in [claims/src/public/claim.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L26)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  createJWT

▸ **createJWT**(): *Promise‹void›*

*Defined in [claims/src/public/claim.ts:80](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L80)*

**Returns:** *Promise‹void›*

___

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Implementation of [IClaim](../interfaces/iclaim.md)*

*Defined in [claims/src/public/claim.ts:69](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L69)*

**Returns:** *Promise‹boolean›*
