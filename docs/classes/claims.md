[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Claims](claims.md)

# Class: Claims

## Hierarchy

* **Claims**

## Implements

* [IClaims](../interfaces/iclaims.md)

## Index

### Constructors

* [constructor](claims.md#constructor)

### Methods

* [createPrivateClaim](claims.md#createprivateclaim)
* [createProofClaim](claims.md#createproofclaim)
* [createPublicClaim](claims.md#createpublicclaim)
* [generateClaimFromToken](claims.md#generateclaimfromtoken)

## Constructors

###  constructor

\+ **new Claims**(`keyPair`: IKeys): *[Claims](claims.md)*

*Defined in [claims/src/index.ts:13](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/index.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`keyPair` | IKeys |

**Returns:** *[Claims](claims.md)*

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md), `didIssuer`: string): *Promise‹[IPrivateClaim](../interfaces/iprivateclaim.md)›*

*Implementation of [IClaims](../interfaces/iclaims.md)*

*Defined in [claims/src/index.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/index.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) |
`didIssuer` | string |

**Returns:** *Promise‹[IPrivateClaim](../interfaces/iprivateclaim.md)›*

___

###  createProofClaim

▸ **createProofClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md), `hashedFields`: number[]): *Promise‹[IProofClaim](../interfaces/iproofclaim.md)›*

*Implementation of [IClaims](../interfaces/iclaims.md)*

*Defined in [claims/src/index.ts:41](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/index.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) |
`hashedFields` | number[] |

**Returns:** *Promise‹[IProofClaim](../interfaces/iproofclaim.md)›*

___

###  createPublicClaim

▸ **createPublicClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md)): *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md)›*

*Implementation of [IClaims](../interfaces/iclaims.md)*

*Defined in [claims/src/index.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/index.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) |

**Returns:** *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md)›*

___

###  generateClaimFromToken

▸ **generateClaimFromToken**(`token`: string, `type`: [ClaimType](../enums/claimtype.md)): *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md) | [IPrivateClaim](../interfaces/iprivateclaim.md) | [IProofClaim](../interfaces/iproofclaim.md)›*

*Implementation of [IClaims](../interfaces/iclaims.md)*

*Defined in [claims/src/index.ts:52](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/claims/src/index.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`type` | [ClaimType](../enums/claimtype.md) |

**Returns:** *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md) | [IPrivateClaim](../interfaces/iprivateclaim.md) | [IProofClaim](../interfaces/iproofclaim.md)›*
