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

Defined in claims/src/models/index.ts:38

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaims](iclaims.md).[jwt](iclaims.md#jwt)*

Defined in claims/src/models/index.ts:40

___

###  keys

• **keys**: *IKeys*

*Inherited from [IClaims](iclaims.md).[keys](iclaims.md#keys)*

Defined in claims/src/models/index.ts:39

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`privateData`: object, `issuer`: string): *Promise‹object›*

Defined in claims/src/interface.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`privateData` | object |
`issuer` | string |

**Returns:** *Promise‹object›*

___

###  createProofClaim

▸ **createProofClaim**(`claimUrl`: string, `saltedFields`: [IProofData](iproofdata.md)): *Promise‹string›*

Defined in claims/src/interface.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`claimUrl` | string |
`saltedFields` | [IProofData](iproofdata.md) |

**Returns:** *Promise‹string›*

___

###  createPublicClaim

▸ **createPublicClaim**(`publicData`: object): *Promise‹string›*

Defined in claims/src/interface.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`publicData` | object |

**Returns:** *Promise‹string›*

___

###  verifyPrivateClaim

▸ **verifyPrivateClaim**(`privateToken`: string, `saltedFields`: [ISaltedFields](isaltedfields.md)): *Promise‹void›*

Defined in claims/src/interface.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`privateToken` | string |
`saltedFields` | [ISaltedFields](isaltedfields.md) |

**Returns:** *Promise‹void›*

___

###  verifyPublicClaim

▸ **verifyPublicClaim**(`token`: string, `verifyData`: object): *Promise‹void›*

Defined in claims/src/interface.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`verifyData` | object |

**Returns:** *Promise‹void›*
