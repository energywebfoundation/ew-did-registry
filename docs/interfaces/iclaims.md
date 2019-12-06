[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaims](iclaims.md)

# Interface: IClaims

IClaims interface is a factory to create Public, Private, and Proof Claims

## Hierarchy

* **IClaims**

## Index

### Methods

* [createPrivateClaim](iclaims.md#createprivateclaim)
* [createProofClaim](iclaims.md#createproofclaim)
* [createPublicClaim](iclaims.md#createpublicclaim)
* [generateClaimFromToken](iclaims.md#generateclaimfromtoken)

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`data`: [IClaimData](iclaimdata.md), `didIssuer`: string): *[IPrivateClaim](iprivateclaim.md)*

*Defined in [claims/src/interface.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/1e9cd0b/packages/claims/src/interface.ts#L30)*

Create Private Claim by providing claim data and Issuer's DID

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |
`didIssuer` | string |

**Returns:** *[IPrivateClaim](iprivateclaim.md)*

___

###  createProofClaim

▸ **createProofClaim**(`data`: [IClaimData](iclaimdata.md), `hashedFields`: number[]): *[IProofClaim](iproofclaim.md)*

*Defined in [claims/src/interface.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/1e9cd0b/packages/claims/src/interface.ts#L38)*

Create Proof Claim with claim data and hashed claim fields

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |
`hashedFields` | number[] |

**Returns:** *[IProofClaim](iproofclaim.md)*

___

###  createPublicClaim

▸ **createPublicClaim**(`data`: [IClaimData](iclaimdata.md)): *[IVerificationClaim](iverificationclaim.md)*

*Defined in [claims/src/interface.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/1e9cd0b/packages/claims/src/interface.ts#L22)*

Create Public Claim with claim data

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |

**Returns:** *[IVerificationClaim](iverificationclaim.md)*

___

###  generateClaimFromToken

▸ **generateClaimFromToken**(`token`: string, `type`: [ClaimType](../enums/claimtype.md)): *[IVerificationClaim](iverificationclaim.md) | [IPrivateClaim](iprivateclaim.md) | [IProofClaim](iproofclaim.md)*

*Defined in [claims/src/interface.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/1e9cd0b/packages/claims/src/interface.ts#L46)*

Provided with JWT this method will generate a Claim

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`type` | [ClaimType](../enums/claimtype.md) |

**Returns:** *[IVerificationClaim](iverificationclaim.md) | [IPrivateClaim](iprivateclaim.md) | [IProofClaim](iproofclaim.md)*
