[@ew-did-registry/did](README.md) › [Globals](globals.md)

# @ew-did-registry/did

## Index

### Enumerations

* [ClaimType](enums/claimtype.md)
* [Networks](enums/networks.md)

### Classes

* [Keys](classes/keys.md)

### Interfaces

* [IAuthentication](interfaces/iauthentication.md)
* [IClaim](interfaces/iclaim.md)
* [IClaimBuildData](interfaces/iclaimbuilddata.md)
* [IClaimData](interfaces/iclaimdata.md)
* [IClaims](interfaces/iclaims.md)
* [IDID](interfaces/idid.md)
* [IDIDDocument](interfaces/ididdocument.md)
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
* [IPublicKey](interfaces/ipublickey.md)
* [IResolver](interfaces/iresolver.md)
* [IServiceEndpoint](interfaces/iserviceendpoint.md)
* [IUpdateParameters](interfaces/iupdateparameters.md)
* [IVerificationClaim](interfaces/iverificationclaim.md)
* [KeyPair](interfaces/keypair.md)

### Variables

* [ec](globals.md#const-ec)

### Functions

* [add](globals.md#const-add)
* [sha256](globals.md#const-sha256)

### Object literals

* [ECDSA_PATTERNS](globals.md#const-ecdsa_patterns)
* [hex](globals.md#const-hex)

## Variables

### `Const` ec

• **ec**: *ec‹›* =  new EC('secp256k1')

*Defined in [keys/src/index.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/keys/src/index.ts#L10)*

## Functions

### `Const` add

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [did/src/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/did/src/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [claims/src/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/claims/src/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [did-document/src/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/did-document/src/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [jwt/src/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/jwt/src/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [did-registry/src/index.ts:1](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/did-registry/src/index.ts#L1)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [resolver/src/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/resolver/src/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

___

### `Const` sha256

▸ **sha256**(`data`: string): *string*

*Defined in [keys/src/functions/index.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/keys/src/functions/index.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*

## Object literals

### `Const` ECDSA_PATTERNS

### ▪ **ECDSA_PATTERNS**: *object*

*Defined in [keys/src/models/index.ts:6](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/keys/src/models/index.ts#L6)*

▪ **secp256k1**: *object*

*Defined in [keys/src/models/index.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/keys/src/models/index.ts#L7)*

* **PRIVATE_KEY**: *RegExp‹›* =  /^[a-f0-9]{64}$/

* **PUBLIC_KEY**: *RegExp‹›* =  /^[a-f0-9]{66}$/

* **SIGNATURE**: *RegExp‹›* =  /^[a-f0-9]{128}$/

___

### `Const` hex

### ▪ **hex**: *object*

*Defined in [keys/src/functions/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/keys/src/functions/index.ts#L3)*

###  encode

▸ **encode**(`data`: string): *string*

*Defined in [keys/src/functions/index.ts:4](https://github.com/energywebfoundation/ew-did-registry/blob/3229236/packages/keys/src/functions/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*
