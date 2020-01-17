[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaimsUser](iclaimsuser.md)

# Interface: IClaimsUser

## Hierarchy

* **IClaimsUser**

## Implemented by

* [ClaimsUser](../classes/claimsuser.md)

## Index

### Methods

* [createPrivateClaim](iclaimsuser.md#createprivateclaim)
* [createProofClaim](iclaimsuser.md#createproofclaim)
* [createPublicClaim](iclaimsuser.md#createpublicclaim)
* [verifyPrivateClaim](iclaimsuser.md#verifyprivateclaim)
* [verifyPublicClaim](iclaimsuser.md#verifypublicclaim)

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`claimData`: [IClaimData](iclaimdata.md), `issuerPK`: string): *Promise‹object›*

Defined in claims/src/interface.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`claimData` | [IClaimData](iclaimdata.md) |
`issuerPK` | string |

**Returns:** *Promise‹object›*

___

###  createProofClaim

▸ **createProofClaim**(`claimUrl`: string, `saltedFields`: object): *Promise‹string›*

Defined in claims/src/interface.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`claimUrl` | string |
`saltedFields` | object |

**Returns:** *Promise‹string›*

___

###  createPublicClaim

▸ **createPublicClaim**(`claimData`: [IClaimData](iclaimdata.md)): *Promise‹string›*

Defined in claims/src/interface.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`claimData` | [IClaimData](iclaimdata.md) |

**Returns:** *Promise‹string›*

___

###  verifyPrivateClaim

▸ **verifyPrivateClaim**(`privateToken`: string, `saltedFields`: object): *Promise‹boolean›*

Defined in claims/src/interface.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`privateToken` | string |
`saltedFields` | object |

**Returns:** *Promise‹boolean›*

___

###  verifyPublicClaim

▸ **verifyPublicClaim**(`token`: string): *Promise‹boolean›*

Defined in claims/src/interface.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹boolean›*
