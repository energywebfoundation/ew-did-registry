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

* [claimData](proofclaim.md#claimdata)
* [curve](proofclaim.md#curve)
* [didDocument](proofclaim.md#diddocument)
* [g](proofclaim.md#g)
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

Defined in claims/src/proof/proofClaim.ts:32

Creates claim about possession of some private data.
When created by the owner of the private data, this data must be contained
in `hashedFields`assosiative array. When created by verifier data must contain `token`
created during owner's creation of proof claim

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | [IProofClaimBuildData](../interfaces/iproofclaimbuilddata.md) |   |

**Returns:** *[ProofClaim](proofclaim.md)*

## Properties

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

secp256k1 curve

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claim](claim.md).[didDocument](claim.md#diddocument)*

Defined in claims/src/public/claim.ts:16

didDocument is used to store fetched DID Document

___

###  g

• **g**: *any* =  this.curve.G

Defined in claims/src/proof/proofClaim.ts:25

base of the secp256k1 curve

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

Defined in claims/src/proof/proofClaim.ts:27

___

###  q

• **q**: *any* =  this.curve.r

Defined in claims/src/proof/proofClaim.ts:20

prime order of the secp256k1 base

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

Defined in claims/src/proof/proofClaim.ts:32

token creation completion flag

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

Defined in claims/src/proof/proofClaim.ts:88

Сhecks that the public keys in the `privateToken`'s payload matches values
based on which `this.token` payload was calculated

**`example`** 
```typescript
import { ProofClaim } from '@ew-did-registry/claims';

------------------------------ owner -----------------------------------
const proofClaim = new ProofClaim({jwt, keys, claimData,  hashedFields });
const proofToken = proofClaim.token;
----------------------------- verifier ---------------------------------
const proofClaim = new ProofClaim({jwt, keys, claimData, proofToken });
const privateToken = store.getClaim(claimUrl);
const verified = proofClaim.verify(privateToken);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateToken` | string |   |

**Returns:** *boolean*
