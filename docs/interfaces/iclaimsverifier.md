[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaimsVerifier](iclaimsverifier.md)

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

*Defined in [claims/src/models/index.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/models/index.ts#L38)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaims](iclaims.md).[jwt](iclaims.md#jwt)*

*Defined in [claims/src/models/index.ts:40](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/models/index.ts#L40)*

___

###  keys

• **keys**: *IKeys*

*Inherited from [IClaims](iclaims.md).[keys](iclaims.md#keys)*

*Defined in [claims/src/models/index.ts:39](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/models/index.ts#L39)*

## Methods

###  verifyPrivateProof

▸ **verifyPrivateProof**(`proofToken`: string, `privateToken`: string): *Promise‹void›*

*Defined in [claims/src/interface.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/interface.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`proofToken` | string |
`privateToken` | string |

**Returns:** *Promise‹void›*

___

###  verifyPublicProof

▸ **verifyPublicProof**(`token`: string): *Promise‹void›*

*Defined in [claims/src/interface.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/interface.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹void›*
