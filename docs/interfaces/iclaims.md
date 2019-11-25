[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaims](iclaims.md)

# Interface: IClaims

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

*Defined in [claims/src/interface.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/42a382a/packages/claims/src/interface.ts#L26)*

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

*Defined in [claims/src/interface.ts:34](https://github.com/energywebfoundation/ew-did-registry/blob/42a382a/packages/claims/src/interface.ts#L34)*

Create Proof Claim with claim data and hashed claim fields

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |
`hashedFields` | number[] |

**Returns:** *[IProofClaim](iproofclaim.md)*

___

###  createPublicClaim

▸ **createPublicClaim**(`data`: [IClaimData](iclaimdata.md)): *[IClaim](iclaim.md)*

*Defined in [claims/src/interface.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/42a382a/packages/claims/src/interface.ts#L18)*

Create Public Claim with claim data

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IClaimData](iclaimdata.md) |

**Returns:** *[IClaim](iclaim.md)*

___

###  generateClaimFromToken

▸ **generateClaimFromToken**(`token`: string, `type`: [ClaimType](../enums/claimtype.md)): *[IClaim](iclaim.md)*

*Defined in [claims/src/interface.ts:42](https://github.com/energywebfoundation/ew-did-registry/blob/42a382a/packages/claims/src/interface.ts#L42)*

Provided with JWT this method will generate a Claim

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`type` | [ClaimType](../enums/claimtype.md) |

**Returns:** *[IClaim](iclaim.md)*
