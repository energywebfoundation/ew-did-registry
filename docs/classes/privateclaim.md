[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [PrivateClaim](privateclaim.md)

# Class: PrivateClaim

## Hierarchy

  ↳ [VerificationClaim](verificationclaim.md)

  ↳ **PrivateClaim**

## Implements

* [IClaim](../interfaces/iclaim.md)
* [IVerificationClaim](../interfaces/iverificationclaim.md)
* [IPrivateClaim](../interfaces/iprivateclaim.md)

## Index

### Constructors

* [constructor](privateclaim.md#constructor)

### Properties

* [claimData](privateclaim.md#claimdata)
* [jwt](privateclaim.md#jwt)
* [keyPair](privateclaim.md#keypair)
* [token](privateclaim.md#token)

### Methods

* [approve](privateclaim.md#approve)
* [getDid](privateclaim.md#getdid)
* [verify](privateclaim.md#verify)
* [verifyPayload](privateclaim.md#verifypayload)

## Constructors

###  constructor

\+ **new PrivateClaim**(`data`: [IPrivateClaimBuildData](../interfaces/iprivateclaimbuilddata.md)): *[PrivateClaim](privateclaim.md)*

*Overrides [Claim](claim.md).[constructor](claim.md#constructor)*

Defined in claims/src/private/index.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IPrivateClaimBuildData](../interfaces/iprivateclaimbuilddata.md) |

**Returns:** *[PrivateClaim](privateclaim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[claimData](../interfaces/iprivateclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

Defined in claims/src/public/claim.ts:7

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[jwt](../interfaces/iprivateclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

Defined in claims/src/public/claim.ts:9

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[keyPair](../interfaces/iprivateclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

Defined in claims/src/public/claim.ts:11

___

###  token

• **token**: *string*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[token](../interfaces/iprivateclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

Defined in claims/src/public/claim.ts:13

## Methods

###  approve

▸ **approve**(): *string*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [VerificationClaim](verificationclaim.md).[approve](verificationclaim.md#approve)*

Defined in claims/src/public/verificationClaim.ts:7

**Returns:** *string*

___

###  getDid

▸ **getDid**(): *string*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

Defined in claims/src/public/claim.ts:22

**Returns:** *string*

___

###  verify

▸ **verify**(): *boolean*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [VerificationClaim](verificationclaim.md).[verify](verificationclaim.md#verify)*

Defined in claims/src/public/verificationClaim.ts:11

**Returns:** *boolean*

___

###  verifyPayload

▸ **verifyPayload**(`hashedFields`: number[]): *boolean*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

Defined in claims/src/private/index.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`hashedFields` | number[] |

**Returns:** *boolean*
