[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ProofClaim](proofclaim.md)

# Class: ProofClaim

## Hierarchy

* [Claim](claim.md)

  ↳ **ProofClaim**

## Implements

* [IClaim](../interfaces/iclaim.md)
* [IProofClaim](../interfaces/iproofclaim.md)

## Index

### Constructors

* [constructor](proofclaim.md#constructor)

### Properties

* [_hashedFields](proofclaim.md#_hashedfields)
* [claimData](proofclaim.md#claimdata)
* [curve](proofclaim.md#curve)
* [didDocument](proofclaim.md#diddocument)
* [jwt](proofclaim.md#jwt)
* [keyPair](proofclaim.md#keypair)
* [paranoia](proofclaim.md#paranoia)
* [q](proofclaim.md#q)
* [token](proofclaim.md#token)
* [tokenCreated](proofclaim.md#tokencreated)

### Methods

* [createJWT](proofclaim.md#createjwt)
* [getDid](proofclaim.md#getdid)
* [verify](proofclaim.md#verify)

## Constructors

###  constructor

\+ **new ProofClaim**(`data`: [IProofClaimBuildData](../interfaces/iproofclaimbuilddata.md)): *[ProofClaim](proofclaim.md)*

*Overrides [Claim](claim.md).[constructor](claim.md#constructor)*

Defined in claims/src/proof/proofClaim.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`data` | [IProofClaimBuildData](../interfaces/iproofclaimbuilddata.md) |

**Returns:** *[ProofClaim](proofclaim.md)*

## Properties

###  _hashedFields

• **_hashedFields**: *number[]*

Defined in claims/src/proof/proofClaim.ts:13

hashed private values

___

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[claimData](../interfaces/iproofclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

Defined in claims/src/public/claim.ts:31

claimData stores the claim fields

___

###  curve

• **curve**: *sjcl.SjclEllipticalCurve* =  sjcl.ecc.curves.k256

Defined in claims/src/proof/proofClaim.ts:15

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claim](claim.md).[didDocument](claim.md#diddocument)*

Defined in claims/src/public/claim.ts:16

didDocument is used to store fetched DID Document

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[jwt](../interfaces/iproofclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

Defined in claims/src/public/claim.ts:21

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[keyPair](../interfaces/iproofclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

Defined in claims/src/public/claim.ts:36

keyPair represents the implementation of key management interface

___

###  paranoia

• **paranoia**: *number* = 6

Defined in claims/src/proof/proofClaim.ts:19

___

###  q

• **q**: *any* =  this.curve.r

Defined in claims/src/proof/proofClaim.ts:17

___

###  token

• **token**: *string*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md).[token](../interfaces/iproofclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

Defined in claims/src/public/claim.ts:26

claimToken stores the actual serialised JWT in a string format

___

###  tokenCreated

• **tokenCreated**: *Promise‹void›*

Defined in claims/src/proof/proofClaim.ts:21

## Methods

###  createJWT

▸ **createJWT**(): *Promise‹void›*

*Inherited from [Claim](claim.md).[createJWT](claim.md#createjwt)*

Defined in claims/src/public/claim.ts:80

**Returns:** *Promise‹void›*

___

###  getDid

▸ **getDid**(): *Promise‹boolean›*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

Defined in claims/src/public/claim.ts:69

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(`privateToken`: string): *boolean*

*Implementation of [IProofClaim](../interfaces/iproofclaim.md)*

Defined in claims/src/proof/proofClaim.ts:60

Сhecks that the public keys in the private token payload matches the values based on
which the this.token payload was calculated

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateToken` | string |   |

**Returns:** *boolean*
