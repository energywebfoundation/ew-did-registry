[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaimsVerifier](iclaimsverifier.md)

# Interface: IClaimsVerifier

## Hierarchy

* **IClaimsVerifier**

## Implemented by

* [ClaimsVerifier](../classes/claimsverifier.md)

## Index

### Methods

* [verifyPrivateProof](iclaimsverifier.md#verifyprivateproof)
* [verifyPublicProof](iclaimsverifier.md#verifypublicproof)

## Methods

###  verifyPrivateProof

▸ **verifyPrivateProof**(`proofToken`: string, `privateToken`: string): *boolean*

Defined in claims/src/interface.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`proofToken` | string |
`privateToken` | string |

**Returns:** *boolean*

___

###  verifyPublicProof

▸ **verifyPublicProof**(`token`: string): *Promise‹boolean›*

Defined in claims/src/interface.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹boolean›*
