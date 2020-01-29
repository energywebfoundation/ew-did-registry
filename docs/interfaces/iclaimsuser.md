[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IClaimsUser](iclaimsuser.md)

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

*Defined in [claims/src/models/index.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/models/index.ts#L20)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaims](iclaims.md).[jwt](iclaims.md#jwt)*

*Defined in [claims/src/models/index.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/models/index.ts#L22)*

___

###  keys

• **keys**: *IKeys*

*Inherited from [IClaims](iclaims.md).[keys](iclaims.md#keys)*

*Defined in [claims/src/models/index.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/models/index.ts#L21)*

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`claimData`: [IClaimData](iclaimdata.md), `issuer`: string): *Promise‹object›*

*Defined in [claims/src/interface.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/interface.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`claimData` | [IClaimData](iclaimdata.md) |
`issuer` | string |

**Returns:** *Promise‹object›*

___

###  createProofClaim

▸ **createProofClaim**(`claimUrl`: string, `saltedFields`: object): *Promise‹string›*

*Defined in [claims/src/interface.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/interface.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`claimUrl` | string |
`saltedFields` | object |

**Returns:** *Promise‹string›*

___

###  createPublicClaim

▸ **createPublicClaim**(`claimData`: [IClaimData](iclaimdata.md)): *Promise‹string›*

*Defined in [claims/src/interface.ts:15](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/interface.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`claimData` | [IClaimData](iclaimdata.md) |

**Returns:** *Promise‹string›*

___

###  verifyPrivateClaim

▸ **verifyPrivateClaim**(`privateToken`: string, `saltedFields`: object): *Promise‹boolean›*

*Defined in [claims/src/interface.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/interface.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`privateToken` | string |
`saltedFields` | object |

**Returns:** *Promise‹boolean›*

___

###  verifyPublicClaim

▸ **verifyPublicClaim**(`token`: string): *Promise‹boolean›*

*Defined in [claims/src/interface.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/interface.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹boolean›*
