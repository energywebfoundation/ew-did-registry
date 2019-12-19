[@ew-did-registry/claims](README.md) › [Globals](globals.md)

# @ew-did-registry/claims

## Index

### Enumerations

* [ClaimType](enums/claimtype.md)
* [Networks](enums/networks.md)
* [ProviderTypes](enums/providertypes.md)

### Classes

* [DID](classes/did.md)
* [JWT](classes/jwt.md)
* [Keys](classes/keys.md)
* [Operator](classes/operator.md)
* [Resolver](classes/resolver.md)

### Interfaces

* [IAuthentication](interfaces/iauthentication.md)
* [IClaim](interfaces/iclaim.md)
* [IClaimBuildData](interfaces/iclaimbuilddata.md)
* [IClaimData](interfaces/iclaimdata.md)
* [IClaims](interfaces/iclaims.md)
* [IDID](interfaces/idid.md)
* [IDIDDocument](interfaces/ididdocument.md)
* [IDIDDocumentFactory](interfaces/ididdocumentfactory.md)
* [IDIDDocumentFull](interfaces/ididdocumentfull.md)
* [IDIDDocumentLite](interfaces/ididdocumentlite.md)
* [IDIDRegistry](interfaces/ididregistry.md)
* [IDidStore](interfaces/ididstore.md)
* [IJWT](interfaces/ijwt.md)
* [IKeys](interfaces/ikeys.md)
* [ILinkedDataProof](interfaces/ilinkeddataproof.md)
* [IOperator](interfaces/ioperator.md)
* [IPrivateClaim](interfaces/iprivateclaim.md)
* [IPrivateClaimBuildData](interfaces/iprivateclaimbuilddata.md)
* [IProofClaim](interfaces/iproofclaim.md)
* [IProofClaimBuildData](interfaces/iproofclaimbuilddata.md)
* [IProvider](interfaces/iprovider.md)
* [IPublicKey](interfaces/ipublickey.md)
* [IResolver](interfaces/iresolver.md)
* [IResolverSettings](interfaces/iresolversettings.md)
* [IServiceEndpoint](interfaces/iserviceendpoint.md)
* [IUpdateParameters](interfaces/iupdateparameters.md)
* [IVerificationClaim](interfaces/iverificationclaim.md)
* [KeyPair](interfaces/keypair.md)

### Variables

* [ec](globals.md#const-ec)
* [fail](globals.md#fail)
* [keyEncoder](globals.md#const-keyencoder)
* [keyPairAlice](globals.md#let-keypairalice)
* [payload](globals.md#let-payload)
* [token](globals.md#let-token)

### Functions

* [add](globals.md#const-add)
* [sha256](globals.md#const-sha256)

### Object literals

* [DID_SCHEME_PATTERNS](globals.md#const-did_scheme_patterns)
* [ECDSA_PATTERNS](globals.md#const-ecdsa_patterns)
* [hex](globals.md#const-hex)

## Variables

### `Const` ec

• **ec**: *ec‹›* =  new EC('secp256k1')

Defined in keys/src/index.ts:10

___

###  fail

• **fail**: *fail*

Defined in did-resolver/test/operator.test.ts:8

___

### `Const` keyEncoder

• **keyEncoder**: *KeyEncoder‹›* =  new KeyEncoder('secp256k1')

Defined in jwt/src/index.ts:7

___

### `Let` keyPairAlice

• **keyPairAlice**: *IKeys*

Defined in jwt/test/jwt.test.ts:8

___

### `Let` payload

• **payload**: *object*

Defined in jwt/test/jwt.test.ts:6

___

### `Let` token

• **token**: *string*

Defined in jwt/test/jwt.test.ts:7

## Functions

### `Const` add

▸ **add**(`left`: number, `right`: number): *number*

Defined in claims/src/index.ts:3

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

Defined in did-document/src/index.ts:3

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

Defined in did-registry/src/index.ts:1

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

Defined in did-resolver/src/index.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

___

### `Const` sha256

▸ **sha256**(`data`: string): *string*

Defined in keys/src/functions/index.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*

## Object literals

### `Const` DID_SCHEME_PATTERNS

### ▪ **DID_SCHEME_PATTERNS**: *object*

Defined in did/src/models/index.ts:10

###  ID

• **ID**: *RegExp‹›* =  /^[\w.-]*(:[\w.-]*)*$/

Defined in did/src/models/index.ts:19

DID specification rule for method-specific-id
DID specification rule for method-name
The pattern allows an empty identifier to identify a method or did-registry
See [Issue 34] [https://github.com/w3c/did-core/issues/34](https://github.com/w3c/did-core/issues/34)

###  NETWORK

• **NETWORK**: *RegExp‹›* =  /^[a-z0-9]+$/

Defined in did/src/models/index.ts:12

___

### `Const` ECDSA_PATTERNS

### ▪ **ECDSA_PATTERNS**: *object*

Defined in keys/src/models/index.ts:6

▪ **secp256k1**: *object*

Defined in keys/src/models/index.ts:7

* **PRIVATE_KEY**: *RegExp‹›* =  /^[a-f0-9]{64}$/

* **PUBLIC_KEY**: *RegExp‹›* =  /^[a-f0-9]{66}$/

* **SIGNATURE**: *RegExp‹›* =  /^[a-f0-9]{128}$/

___

### `Const` hex

### ▪ **hex**: *object*

Defined in keys/src/functions/index.ts:3

###  encode

▸ **encode**(`data`: string): *string*

Defined in keys/src/functions/index.ts:4

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*
