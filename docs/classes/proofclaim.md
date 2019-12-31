[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ProofClaim](proofclaim.md)

# Class: ProofClaim

## Hierarchy

* [Claim](claim.md)

  ↳ **ProofClaim**

## Implements

* [IClaim](../interfaces/iclaim.md)
* [IProofClaim](../interfaces/iproofclaim.md)

## Index

### Constructors

* [constructor](proofclaim.md#constructor)

### Properties

* [claimData](proofclaim.md#claimdata)
* [jwt](proofclaim.md#jwt)
* [keyPair](proofclaim.md#keypair)
* [token](proofclaim.md#token)

### Methods

* [getDid](proofclaim.md#getdid)
* [verify](proofclaim.md#verify)

## Constructors

###  constructor

\+ **new ProofClaim**(`data`: [IProofClaimBuildData](../interfaces/iproofclaimbuilddata.md)): *[ProofClaim](proofclaim.md)*

*Overrides [Claim](claim.md).[constructor](claim.md#constructor)*

Defined in claims/src/proof/index.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IProofClaimBuildData](../interfaces/iproofclaimbuilddata.md) |

**Returns:** *[ProofClaim](proofclaim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[claimData](../interfaces/iproofclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

Defined in claims/src/public/claim.ts:7

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[jwt](../interfaces/iproofclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

Defined in claims/src/public/claim.ts:9

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[keyPair](../interfaces/iproofclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

Defined in claims/src/public/claim.ts:11

___

###  token

• **token**: *string*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[token](../interfaces/iproofclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

Defined in claims/src/public/claim.ts:13

## Methods

###  getDid

▸ **getDid**(): *string*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

Defined in claims/src/public/claim.ts:22

**Returns:** *string*

___

###  verify

▸ **verify**(`privateToken`: string): *boolean*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md)*

Defined in claims/src/proof/index.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`privateToken` | string |

**Returns:** *boolean*
