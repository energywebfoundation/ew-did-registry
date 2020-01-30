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

*Defined in [claims/src/models/index.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/claims/src/models/index.ts#L31)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaims](iclaims.md).[jwt](iclaims.md#jwt)*

*Defined in [claims/src/models/index.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/claims/src/models/index.ts#L33)*

___

###  keys

• **keys**: *IKeys*

*Inherited from [IClaims](iclaims.md).[keys](iclaims.md#keys)*

*Defined in [claims/src/models/index.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/claims/src/models/index.ts#L32)*

## Methods

###  verifyPrivateProof

▸ **verifyPrivateProof**(`proofToken`: string, `privateToken`: string): *Promise‹void›*

*Defined in [claims/src/interface.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/claims/src/interface.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`proofToken` | string |
`privateToken` | string |

**Returns:** *Promise‹void›*

___

###  verifyPublicProof

▸ **verifyPublicProof**(`token`: string): *Promise‹void›*

*Defined in [claims/src/interface.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/claims/src/interface.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹void›*
