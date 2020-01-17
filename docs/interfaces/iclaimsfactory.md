[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IClaimsFactory](iclaimsfactory.md)

# Interface: IClaimsFactory

IClaims interface is a factory to create Public, Private, and Proof Claims

## Hierarchy

* **IClaimsFactory**

## Implemented by

* [ClaimsFactory](../classes/claimsfactory.md)

## Index

### Methods

* [createClaimsIssuer](iclaimsfactory.md#createclaimsissuer)
* [createClaimsUser](iclaimsfactory.md#createclaimsuser)
* [createClaimsVerifier](iclaimsfactory.md#createclaimsverifier)

## Methods

###  createClaimsIssuer

▸ **createClaimsIssuer**(`keys`: IKeys, `resolver`: IResolver): *[IClaimsIssuer](iclaimsissuer.md)*

Defined in claims/src/interface.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[IClaimsIssuer](iclaimsissuer.md)*

___

###  createClaimsUser

▸ **createClaimsUser**(`keys`: IKeys, `resolver`: IResolver): *[IClaimsUser](iclaimsuser.md)*

Defined in claims/src/interface.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[IClaimsUser](iclaimsuser.md)*

___

###  createClaimsVerifier

▸ **createClaimsVerifier**(`keys`: IKeys, `resolver`: IResolver): *[IClaimsVerifier](iclaimsverifier.md)*

Defined in claims/src/interface.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[IClaimsVerifier](iclaimsverifier.md)*
