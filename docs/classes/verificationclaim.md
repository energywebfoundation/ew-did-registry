[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [VerificationClaim](verificationclaim.md)

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
* [jwt](verificationclaim.md#jwt)
* [keyPair](verificationclaim.md#keypair)
* [token](verificationclaim.md#token)

### Methods

* [approve](verificationclaim.md#approve)
* [getDid](verificationclaim.md#getdid)
* [verify](verificationclaim.md#verify)

## Constructors

###  constructor

\+ **new VerificationClaim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md), `keys`: IKeys): *[VerificationClaim](verificationclaim.md)*

*Overrides [Claim](claim.md).[constructor](claim.md#constructor)*

*Defined in [claims/src/public/verificationClaim.ts:6](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/verificationClaim.ts#L6)*

Key pair has to be passed on construction to Verification Claim

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | [IClaimBuildData](../interfaces/iclaimbuilddata.md) | - |
`keys` | IKeys |   |

**Returns:** *[VerificationClaim](verificationclaim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[claimData](../interfaces/iverificationclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

*Defined in [claims/src/public/claim.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/claim.ts#L33)*

claimData stores the claim fields

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[jwt](../interfaces/iverificationclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

*Defined in [claims/src/public/claim.ts:23](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/claim.ts#L23)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[keyPair](../interfaces/iverificationclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

*Defined in [claims/src/public/claim.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/claim.ts#L38)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[token](../interfaces/iverificationclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

*Defined in [claims/src/public/claim.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/claim.ts#L28)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Defined in [claims/src/public/verificationClaim.ts:27](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/verificationClaim.ts#L27)*

**Returns:** *Promise‹string›*

___

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

*Defined in [claims/src/public/claim.ts:58](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/claim.ts#L58)*

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *boolean*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Defined in [claims/src/public/verificationClaim.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/4dc2947/packages/claims/src/public/verificationClaim.ts#L17)*

**Returns:** *boolean*
