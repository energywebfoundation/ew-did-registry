[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [VerificationClaim](verificationclaim.md)

# Class: VerificationClaim

## Hierarchy

* [Claim](claim.md)

  ↳ **VerificationClaim**

## Implements

* [IClaim](../interfaces/iclaim.md)
* [IVerificationClaim](../interfaces/iverificationclaim.md)

## Index

### Constructors

* [constructor](verificationclaim.md#constructor)

### Properties

* [claimData](verificationclaim.md#claimdata)
* [didDocument](verificationclaim.md#diddocument)
* [jwt](verificationclaim.md#jwt)
* [keyPair](verificationclaim.md#keypair)
* [token](verificationclaim.md#token)

### Methods

* [approve](verificationclaim.md#approve)
* [createJWT](verificationclaim.md#createjwt)
* [getDid](verificationclaim.md#getdid)
* [verify](verificationclaim.md#verify)

## Constructors

###  constructor

\+ **new VerificationClaim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[VerificationClaim](verificationclaim.md)*

*Inherited from [Claim](claim.md).[constructor](claim.md#constructor)*

*Defined in [claims/src/public/claim.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L36)*

Constructor

Settings have to be passed to construct resolver

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimBuildData](../interfaces/iclaimbuilddata.md) |

**Returns:** *[VerificationClaim](verificationclaim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[claimData](../interfaces/iverificationclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

*Defined in [claims/src/public/claim.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L31)*

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claim](claim.md).[didDocument](claim.md#diddocument)*

*Defined in [claims/src/public/claim.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L16)*

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[jwt](../interfaces/iverificationclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

*Defined in [claims/src/public/claim.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L21)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[keyPair](../interfaces/iverificationclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

*Defined in [claims/src/public/claim.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L36)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[token](../interfaces/iverificationclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

*Defined in [claims/src/public/claim.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L26)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Defined in [claims/src/public/verificationClaim.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/verificationClaim.ts#L16)*

**Returns:** *Promise‹string›*

___

###  createJWT

▸ **createJWT**(): *Promise‹void›*

*Inherited from [Claim](claim.md).[createJWT](claim.md#createjwt)*

*Defined in [claims/src/public/claim.ts:80](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L80)*

**Returns:** *Promise‹void›*

___

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

*Defined in [claims/src/public/claim.ts:69](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/claim.ts#L69)*

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *Promise‹boolean›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Defined in [claims/src/public/verificationClaim.ts:5](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/claims/src/public/verificationClaim.ts#L5)*

**Returns:** *Promise‹boolean›*
