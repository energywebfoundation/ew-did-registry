[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IClaimsVerifier](iclaimsverifier.md)

# Interface: IClaimsVerifier

## Hierarchy

* [IClaims](iclaims.md)

  ↳ **IClaimsVerifier**

## Implemented by

* [ClaimsVerifier](../classes/claimsverifier.md)

## Index

### Properties

* [did](iclaimsverifier.md#did)
* [jwt](iclaimsverifier.md#jwt)
* [keys](iclaimsverifier.md#keys)

### Methods

* [verifyPrivateProof](iclaimsverifier.md#verifyprivateproof)
* [verifyPublicProof](iclaimsverifier.md#verifypublicproof)

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

###  verifyPrivateProof

▸ **verifyPrivateProof**(`proofToken`: string, `privateToken`: string): *Promise‹boolean›*

*Defined in [claims/src/interface.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/interface.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`proofToken` | string |
`privateToken` | string |

**Returns:** *Promise‹boolean›*

___

###  verifyPublicProof

▸ **verifyPublicProof**(`token`: string): *Promise‹boolean›*

*Defined in [claims/src/interface.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/claims/src/interface.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹boolean›*
