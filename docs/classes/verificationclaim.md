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
* [getDid](verificationclaim.md#getdid)
* [verify](verificationclaim.md#verify)

## Constructors

###  constructor

\+ **new VerificationClaim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[VerificationClaim](verificationclaim.md)*

*Inherited from [Claim](claim.md).[constructor](claim.md#constructor)*

*Defined in [claims/src/public/claim.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L38)*

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

*Defined in [claims/src/public/claim.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L33)*

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claim](claim.md).[didDocument](claim.md#diddocument)*

*Defined in [claims/src/public/claim.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L18)*

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[jwt](../interfaces/iverificationclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

*Defined in [claims/src/public/claim.ts:23](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L23)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[keyPair](../interfaces/iverificationclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

*Defined in [claims/src/public/claim.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L38)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[token](../interfaces/iverificationclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

*Defined in [claims/src/public/claim.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L28)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Defined in [claims/src/public/verificationClaim.ts:15](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/verificationClaim.ts#L15)*

**Returns:** *Promise‹string›*

___

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

*Defined in [claims/src/public/claim.ts:62](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/claim.ts#L62)*

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *boolean*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Defined in [claims/src/public/verificationClaim.ts:5](https://github.com/energywebfoundation/ew-did-registry/blob/d86fc0d/packages/claims/src/public/verificationClaim.ts#L5)*

**Returns:** *boolean*
