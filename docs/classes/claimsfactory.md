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

*Defined in [claims/src/claimsFactory/claimsFactory.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/claimsFactory/claimsFactory.ts#L17)*

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

*Defined in [claims/src/claimsFactory/claimsFactory.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/claimsFactory/claimsFactory.ts#L38)*

Contstructs instance of ClaimsIssuer

**Returns:** *[IClaimsIssuer](../interfaces/iclaimsissuer.md)*

___

###  createClaimsUser

▸ **createClaimsUser**(): *[IClaimsUser](../interfaces/iclaimsuser.md)*

*Implementation of [IClaimsFactory](../interfaces/iclaimsfactory.md)*

*Defined in [claims/src/claimsFactory/claimsFactory.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/claimsFactory/claimsFactory.ts#L29)*

Constructs instance of ClaimsUser

**Returns:** *[IClaimsUser](../interfaces/iclaimsuser.md)*

___

###  createClaimsVerifier

▸ **createClaimsVerifier**(): *[IClaimsVerifier](../interfaces/iclaimsverifier.md)*

*Implementation of [IClaimsFactory](../interfaces/iclaimsfactory.md)*

*Defined in [claims/src/claimsFactory/claimsFactory.ts:47](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/claims/src/claimsFactory/claimsFactory.ts#L47)*

Constructs instance of ClaimsUser

**Returns:** *[IClaimsVerifier](../interfaces/iclaimsverifier.md)*
