[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaimsUser](iclaimsuser.md)

# Interface: IClaimsUser

## Hierarchy

* [IClaims](iclaims.md)

  ↳ **IClaimsUser**

## Implemented by

* [ClaimsUser](../classes/claimsuser.md)

## Index

### Properties

* [did](iclaimsuser.md#did)
* [jwt](iclaimsuser.md#jwt)
* [keys](iclaimsuser.md#keys)

### Methods

* [createPrivateClaim](iclaimsuser.md#createprivateclaim)
* [createProofClaim](iclaimsuser.md#createproofclaim)
* [createPublicClaim](iclaimsuser.md#createpublicclaim)
* [verifyPrivateClaim](iclaimsuser.md#verifyprivateclaim)
* [verifyPublicClaim](iclaimsuser.md#verifypublicclaim)

## Properties

###  did

• **did**: *string*

*Inherited from [IClaims](iclaims.md).[did](iclaims.md#did)*

Defined in claims/src/models/index.ts:21

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaims](iclaims.md).[jwt](iclaims.md#jwt)*

Defined in claims/src/models/index.ts:23

___

###  keys

• **keys**: *IKeys*

*Inherited from [IClaims](iclaims.md).[keys](iclaims.md#keys)*

Defined in claims/src/models/index.ts:22

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`publicData`: [IClaimData](iclaimdata.md), `privateData`: [IClaimData](iclaimdata.md), `issuer`: string): *Promise‹object›*

Defined in claims/src/interface.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`publicData` | [IClaimData](iclaimdata.md) |
`privateData` | [IClaimData](iclaimdata.md) |
`issuer` | string |

**Returns:** *Promise‹object›*

___

###  createProofClaim

▸ **createProofClaim**(`claimUrl`: string, `saltedFields`: object): *Promise‹string›*

Defined in claims/src/interface.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`claimUrl` | string |
`saltedFields` | object |

**Returns:** *Promise‹string›*

___

###  createPublicClaim

▸ **createPublicClaim**(`publicData`: [IClaimData](iclaimdata.md)): *Promise‹string›*

Defined in claims/src/interface.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`publicData` | [IClaimData](iclaimdata.md) |

**Returns:** *Promise‹string›*

___

###  verifyPrivateClaim

▸ **verifyPrivateClaim**(`privateToken`: string, `saltedFields`: object, `publicData`: [IClaimData](iclaimdata.md)): *Promise‹void›*

Defined in claims/src/interface.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`privateToken` | string |
`saltedFields` | object |
`publicData` | [IClaimData](iclaimdata.md) |

**Returns:** *Promise‹void›*

___

###  verifyPublicClaim

▸ **verifyPublicClaim**(`token`: string, `verifyData`: [IClaimData](iclaimdata.md)): *Promise‹void›*

Defined in claims/src/interface.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`verifyData` | [IClaimData](iclaimdata.md) |

**Returns:** *Promise‹void›*
