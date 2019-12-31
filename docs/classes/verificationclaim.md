[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [VerificationClaim](verificationclaim.md)

# Class: VerificationClaim

## Hierarchy

* [Claim](claim.md)

  ↳ **VerificationClaim**

  ↳ [PrivateClaim](privateclaim.md)

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

\+ **new VerificationClaim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[VerificationClaim](verificationclaim.md)*

*Inherited from [Claim](claim.md).[constructor](claim.md#constructor)*

Defined in claims/src/public/claim.ts:13

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

Defined in claims/src/public/claim.ts:7

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[jwt](../interfaces/iverificationclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

Defined in claims/src/public/claim.ts:9

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[keyPair](../interfaces/iverificationclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

Defined in claims/src/public/claim.ts:11

___

###  token

• **token**: *string*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md).[token](../interfaces/iverificationclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

Defined in claims/src/public/claim.ts:13

## Methods

###  approve

▸ **approve**(): *string*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

Defined in claims/src/public/verificationClaim.ts:7

**Returns:** *string*

___

###  getDid

▸ **getDid**(): *string*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

Defined in claims/src/public/claim.ts:22

**Returns:** *string*

___

###  verify

▸ **verify**(): *boolean*

*Implementation of [IVerificationClaim](../interfaces/iverificationclaim.md)*

Defined in claims/src/public/verificationClaim.ts:11

**Returns:** *boolean*
