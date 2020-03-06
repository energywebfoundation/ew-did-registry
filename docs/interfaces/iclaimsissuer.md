[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaimsIssuer](iclaimsissuer.md)

# Interface: IClaimsIssuer

## Hierarchy

* [IClaims](iclaims.md)

  ↳ **IClaimsIssuer**

## Implemented by

* [ClaimsIssuer](../classes/claimsissuer.md)

## Index

### Properties

* [did](iclaimsissuer.md#did)
* [jwt](iclaimsissuer.md#jwt)
* [keys](iclaimsissuer.md#keys)

### Methods

* [issuePrivateClaim](iclaimsissuer.md#issueprivateclaim)
* [issuePublicClaim](iclaimsissuer.md#issuepublicclaim)

## Properties

###  did

• **did**: *string*

*Inherited from [IClaims](iclaims.md).[did](iclaims.md#did)*

*Defined in [claims/src/models/index.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/claims/src/models/index.ts#L38)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaims](iclaims.md).[jwt](iclaims.md#jwt)*

*Defined in [claims/src/models/index.ts:40](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/claims/src/models/index.ts#L40)*

___

###  keys

• **keys**: *IKeys*

*Inherited from [IClaims](iclaims.md).[keys](iclaims.md#keys)*

*Defined in [claims/src/models/index.ts:39](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/claims/src/models/index.ts#L39)*

## Methods

###  issuePrivateClaim

▸ **issuePrivateClaim**(`token`: string): *Promise‹string›*

*Defined in [claims/src/interface.ts:25](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/claims/src/interface.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*

___

###  issuePublicClaim

▸ **issuePublicClaim**(`token`: string): *Promise‹string›*

*Defined in [claims/src/interface.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/claims/src/interface.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*
