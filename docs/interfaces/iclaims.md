[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaims](iclaims.md)

# Interface: IClaims

IClaims interface is a factory to create Public, Private, and Proof Claims

## Hierarchy

* **IClaims**

## Implemented by

* [Claims](../classes/claims.md)

## Index

### Methods

* [createPrivateClaim](iclaims.md#createprivateclaim)
* [createProofClaim](iclaims.md#createproofclaim)
* [createPublicClaim](iclaims.md#createpublicclaim)
* [generateClaimFromToken](iclaims.md#generateclaimfromtoken)

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`data`: [IClaimData](iclaimdata.md), `didIssuer`: string): *Promise‹[IPrivateClaim](iprivateclaim.md)›*

*Defined in [claims/src/interface.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/interface.ts#L30)*

Create Private Claim by providing claim data and Issuer's DID

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |
`didIssuer` | string |

**Returns:** *Promise‹[IPrivateClaim](iprivateclaim.md)›*

___

###  createProofClaim

▸ **createProofClaim**(`data`: [IClaimData](iclaimdata.md), `hashedFields`: number[]): *Promise‹[IProofClaim](iproofclaim.md)›*

*Defined in [claims/src/interface.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/interface.ts#L38)*

Create Proof Claim with claim data and hashed claim fields

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |
`hashedFields` | number[] |

**Returns:** *Promise‹[IProofClaim](iproofclaim.md)›*

___

###  createPublicClaim

▸ **createPublicClaim**(`data`: [IClaimData](iclaimdata.md)): *Promise‹[IVerificationClaim](iverificationclaim.md)›*

*Defined in [claims/src/interface.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/interface.ts#L22)*

Create Public Claim with claim data

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |

**Returns:** *Promise‹[IVerificationClaim](iverificationclaim.md)›*

___

###  generateClaimFromToken

▸ **generateClaimFromToken**(`token`: string, `type`: [ClaimType](../enums/claimtype.md)): *Promise‹[IVerificationClaim](iverificationclaim.md) | [IPrivateClaim](iprivateclaim.md) | [IProofClaim](iproofclaim.md)›*

*Defined in [claims/src/interface.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/interface.ts#L46)*

Provided with JWT this method will generate a Claim

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`type` | [ClaimType](../enums/claimtype.md) |

**Returns:** *Promise‹[IVerificationClaim](iverificationclaim.md) | [IPrivateClaim](iprivateclaim.md) | [IProofClaim](iproofclaim.md)›*
