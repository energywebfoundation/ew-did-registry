[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ClaimsFactory](claimsfactory.md)

# Class: ClaimsFactory

An implementation of claim factory

**`class`** 

## Hierarchy

* **ClaimsFactory**

## Implements

* [IClaimsFactory](../interfaces/iclaimsfactory.md)

## Index

### Constructors

* [constructor](claimsfactory.md#constructor)

### Methods

* [createClaimsIssuer](claimsfactory.md#createclaimsissuer)
* [createClaimsUser](claimsfactory.md#createclaimsuser)
* [createClaimsVerifier](claimsfactory.md#createclaimsverifier)

## Constructors

###  constructor

\+ **new ClaimsFactory**(`keys`: IKeys, `resolver`: IResolver): *[ClaimsFactory](claimsfactory.md)*

Defined in claims/src/claimsFactory/claimsFactory.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[ClaimsFactory](claimsfactory.md)*

## Methods

###  createClaimsIssuer

▸ **createClaimsIssuer**(): *[IClaimsIssuer](../interfaces/iclaimsissuer.md)*

Defined in claims/src/claimsFactory/claimsFactory.ts:28

**Returns:** *[IClaimsIssuer](../interfaces/iclaimsissuer.md)*

___

###  createClaimsUser

▸ **createClaimsUser**(): *[IClaimsUser](../interfaces/iclaimsuser.md)*

Defined in claims/src/claimsFactory/claimsFactory.ts:24

**Returns:** *[IClaimsUser](../interfaces/iclaimsuser.md)*

___

###  createClaimsVerifier

▸ **createClaimsVerifier**(): *[IClaimsVerifier](../interfaces/iclaimsverifier.md)*

Defined in claims/src/claimsFactory/claimsFactory.ts:32

**Returns:** *[IClaimsVerifier](../interfaces/iclaimsverifier.md)*
