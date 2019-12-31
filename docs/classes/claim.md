[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Claim](claim.md)

# Class: Claim

## Hierarchy

* **Claim**

  ↳ [VerificationClaim](verificationclaim.md)

  ↳ [ProofClaim](proofclaim.md)

## Implements

* [IClaim](../interfaces/iclaim.md)

## Index

### Constructors

* [constructor](claim.md#constructor)

### Properties

* [claimData](claim.md#claimdata)
* [jwt](claim.md#jwt)
* [keyPair](claim.md#keypair)
* [token](claim.md#token)

### Methods

* [getDid](claim.md#getdid)

## Constructors

###  constructor

\+ **new Claim**(`data`: [IClaimBuildData](../interfaces/iclaimbuilddata.md)): *[Claim](claim.md)*

Defined in claims/src/public/claim.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimBuildData](../interfaces/iclaimbuilddata.md) |

**Returns:** *[Claim](claim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IClaim](../interfaces/iclaim.md).[claimData](../interfaces/iclaim.md#claimdata)*

Defined in claims/src/public/claim.ts:7

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IClaim](../interfaces/iclaim.md).[jwt](../interfaces/iclaim.md#jwt)*

Defined in claims/src/public/claim.ts:9

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IClaim](../interfaces/iclaim.md).[keyPair](../interfaces/iclaim.md#keypair)*

Defined in claims/src/public/claim.ts:11

___

###  token

• **token**: *string*

*Implementation of [IClaim](../interfaces/iclaim.md).[token](../interfaces/iclaim.md#token)*

Defined in claims/src/public/claim.ts:13

## Methods

###  getDid

▸ **getDid**(): *string*

*Implementation of [IClaim](../interfaces/iclaim.md)*

Defined in claims/src/public/claim.ts:22

**Returns:** *string*
