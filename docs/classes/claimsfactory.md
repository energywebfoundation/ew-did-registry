[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ClaimsFactory](claimsfactory.md)

# Class: ClaimsFactory

An implementation of claims factory

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

*Defined in [claims/src/claimsFactory/claimsFactory.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/f9a1db1/packages/claims/src/claimsFactory/claimsFactory.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`resolver` | IResolver |

**Returns:** *[ClaimsFactory](claimsfactory.md)*

## Methods

###  createClaimsIssuer

▸ **createClaimsIssuer**(): *[IClaimsIssuer](../interfaces/iclaimsissuer.md)*

*Implementation of [IClaimsFactory](../interfaces/iclaimsfactory.md)*

*Defined in [claims/src/claimsFactory/claimsFactory.ts:39](https://github.com/energywebfoundation/ew-did-registry/blob/f9a1db1/packages/claims/src/claimsFactory/claimsFactory.ts#L39)*

Contstructs instance of ClaimsIssuer

**Returns:** *[IClaimsIssuer](../interfaces/iclaimsissuer.md)*

___

###  createClaimsUser

▸ **createClaimsUser**(): *[IClaimsUser](../interfaces/iclaimsuser.md)*

*Implementation of [IClaimsFactory](../interfaces/iclaimsfactory.md)*

*Defined in [claims/src/claimsFactory/claimsFactory.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/f9a1db1/packages/claims/src/claimsFactory/claimsFactory.ts#L30)*

Constructs instance of ClaimsUser

**Returns:** *[IClaimsUser](../interfaces/iclaimsuser.md)*

___

###  createClaimsVerifier

▸ **createClaimsVerifier**(): *[IClaimsVerifier](../interfaces/iclaimsverifier.md)*

*Implementation of [IClaimsFactory](../interfaces/iclaimsfactory.md)*

*Defined in [claims/src/claimsFactory/claimsFactory.ts:48](https://github.com/energywebfoundation/ew-did-registry/blob/f9a1db1/packages/claims/src/claimsFactory/claimsFactory.ts#L48)*

Constructs instance of ClaimsUser

**Returns:** *[IClaimsVerifier](../interfaces/iclaimsverifier.md)*
