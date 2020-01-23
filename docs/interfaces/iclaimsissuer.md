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

Defined in claims/src/models/index.ts:20

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaims](iclaims.md).[jwt](iclaims.md#jwt)*

Defined in claims/src/models/index.ts:22

___

###  keys

• **keys**: *IKeys*

*Inherited from [IClaims](iclaims.md).[keys](iclaims.md#keys)*

Defined in claims/src/models/index.ts:21

## Methods

###  issuePrivateClaim

▸ **issuePrivateClaim**(`token`: string): *Promise‹string›*

Defined in claims/src/interface.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*

___

###  issuePublicClaim

▸ **issuePublicClaim**(`token`: string): *Promise‹string›*

Defined in claims/src/interface.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |

**Returns:** *Promise‹string›*
