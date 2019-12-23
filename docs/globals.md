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
* [IDIDLogData](interfaces/ididlogdata.md)
* [IDIDRegistry](interfaces/ididregistry.md)
* [IDidStore](interfaces/ididstore.md)
* [IHandlers](interfaces/ihandlers.md)
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
* [ISmartContractEvent](interfaces/ismartcontractevent.md)
* [IUpdateParameters](interfaces/iupdateparameters.md)
* [IVerificationClaim](interfaces/iverificationclaim.md)
* [KeyPair](interfaces/keypair.md)

### Variables

* [abi1056](globals.md#const-abi1056)
* [address1056](globals.md#const-address1056)
* [ec](globals.md#const-ec)
* [keyEncoder](globals.md#const-keyencoder)
* [keyPairAlice](globals.md#let-keypairalice)
* [matchingPatternDid](globals.md#const-matchingpatterndid)
* [matchingPatternDidEvents](globals.md#const-matchingpatterndidevents)
* [payload](globals.md#let-payload)
* [token](globals.md#let-token)

### Functions

* [add](globals.md#const-add)
* [fetchDataFromEvents](globals.md#const-fetchdatafromevents)
* [getEventsFromBlock](globals.md#const-geteventsfromblock)
* [handleAttributeChange](globals.md#const-handleattributechange)
* [handleDelegateChange](globals.md#const-handledelegatechange)
* [sha256](globals.md#const-sha256)
* [updateDocument](globals.md#const-updatedocument)
* [wrapDidDocument](globals.md#const-wrapdiddocument)

### Object literals

* [DID_SCHEME_PATTERNS](globals.md#const-did_scheme_patterns)
* [ECDSA_PATTERNS](globals.md#const-ecdsa_patterns)
* [defaultProvider](globals.md#const-defaultprovider)
* [defaultResolverSettings](globals.md#const-defaultresolversettings)
* [handlers](globals.md#const-handlers)
* [hex](globals.md#const-hex)

## Variables

### `Const` abi1056

• **abi1056**: *object | object[]* =  [
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'owners',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }, { name: '', type: 'bytes32' }, { name: '', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'nonce',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'changed',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'identity', type: 'address' },
      { indexed: false, name: 'owner', type: 'address' },
      { indexed: false, name: 'previousChange', type: 'uint256' },
    ],
    name: 'DIDOwnerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'identity', type: 'address' },
      { indexed: false, name: 'delegateType', type: 'bytes32' },
      { indexed: false, name: 'delegate', type: 'address' },
      { indexed: false, name: 'validTo', type: 'uint256' },
      { indexed: false, name: 'previousChange', type: 'uint256' },
    ],
    name: 'DIDDelegateChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'identity', type: 'address' },
      { indexed: false, name: 'name', type: 'bytes32' },
      { indexed: false, name: 'value', type: 'bytes' },
      { indexed: false, name: 'validTo', type: 'uint256' },
      { indexed: false, name: 'previousChange', type: 'uint256' },
    ],
    name: 'DIDAttributeChanged',
    type: 'event',
  },
  {
    constant: true,
    inputs: [{ name: 'identity', type: 'address' }],
    name: 'identityOwner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'delegateType', type: 'bytes32' },
      { name: 'delegate', type: 'address' },
    ],
    name: 'validDelegate',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'identity', type: 'address' }, { name: 'newOwner', type: 'address' }],
    name: 'changeOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'sigV', type: 'uint8' },
      { name: 'sigR', type: 'bytes32' },
      { name: 'sigS', type: 'bytes32' },
      { name: 'newOwner', type: 'address' },
    ],
    name: 'changeOwnerSigned',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'delegateType', type: 'bytes32' },
      { name: 'delegate', type: 'address' },
      { name: 'validity', type: 'uint256' },
    ],
    name: 'addDelegate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'sigV', type: 'uint8' },
      { name: 'sigR', type: 'bytes32' },
      { name: 'sigS', type: 'bytes32' },
      { name: 'delegateType', type: 'bytes32' },
      { name: 'delegate', type: 'address' },
      { name: 'validity', type: 'uint256' },
    ],
    name: 'addDelegateSigned',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'delegateType', type: 'bytes32' },
      { name: 'delegate', type: 'address' },
    ],
    name: 'revokeDelegate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'sigV', type: 'uint8' },
      { name: 'sigR', type: 'bytes32' },
      { name: 'sigS', type: 'bytes32' },
      { name: 'delegateType', type: 'bytes32' },
      { name: 'delegate', type: 'address' },
    ],
    name: 'revokeDelegateSigned',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'name', type: 'bytes32' },
      { name: 'value', type: 'bytes' },
      { name: 'validity', type: 'uint256' },
    ],
    name: 'setAttribute',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'sigV', type: 'uint8' },
      { name: 'sigR', type: 'bytes32' },
      { name: 'sigS', type: 'bytes32' },
      { name: 'name', type: 'bytes32' },
      { name: 'value', type: 'bytes' },
      { name: 'validity', type: 'uint256' },
    ],
    name: 'setAttributeSigned',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'name', type: 'bytes32' },
      { name: 'value', type: 'bytes' },
    ],
    name: 'revokeAttribute',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'identity', type: 'address' },
      { name: 'sigV', type: 'uint8' },
      { name: 'sigR', type: 'bytes32' },
      { name: 'sigS', type: 'bytes32' },
      { name: 'name', type: 'bytes32' },
      { name: 'value', type: 'bytes' },
    ],
    name: 'revokeAttributeSigned',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

*Defined in [did-resolver/src/constants/index.ts:5](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L5)*

___

### `Const` address1056

• **address1056**: *"0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af"* = "0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af"

*Defined in [did-resolver/src/constants/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L3)*

___

### `Const` ec

• **ec**: *ec‹›* =  new EC('secp256k1')

*Defined in [keys/src/index.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/keys/src/index.ts#L10)*

___

### `Const` keyEncoder

• **keyEncoder**: *KeyEncoder‹›* =  new KeyEncoder('secp256k1')

*Defined in [jwt/src/index.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/jwt/src/index.ts#L7)*

___

### `Let` keyPairAlice

• **keyPairAlice**: *IKeys*

*Defined in [jwt/test/jwt.test.ts:8](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/jwt/test/jwt.test.ts#L8)*

___

### `Const` matchingPatternDid

• **matchingPatternDid**: *RegExp‹›* =  /did:[a-z0-9]+:0x[A-Za-z0-9]{40}/

*Defined in [did-resolver/src/constants/index.ts:256](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L256)*

___

### `Const` matchingPatternDidEvents

• **matchingPatternDidEvents**: *RegExp‹›* =  /^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/

*Defined in [did-resolver/src/constants/index.ts:255](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L255)*

___

### `Let` payload

• **payload**: *object*

*Defined in [jwt/test/jwt.test.ts:6](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/jwt/test/jwt.test.ts#L6)*

___

### `Let` token

• **token**: *string*

*Defined in [jwt/test/jwt.test.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/jwt/test/jwt.test.ts#L7)*

## Functions

### `Const` add

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [claims/src/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/claims/src/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [did-document/src/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-document/src/index.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

▸ **add**(`left`: number, `right`: number): *number*

*Defined in [did-registry/src/index.ts:1](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-registry/src/index.ts#L1)*

**Parameters:**

Name | Type |
------ | ------ |
`left` | number |
`right` | number |

**Returns:** *number*

___

### `Const` fetchDataFromEvents

▸ **fetchDataFromEvents**(`did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `resolverSettings`: [IResolverSettings](interfaces/iresolversettings.md)): *Promise‹void›*

*Defined in [did-resolver/src/functions/index.ts:188](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`document` | [IDIDLogData](interfaces/ididlogdata.md) |
`resolverSettings` | [IResolverSettings](interfaces/iresolversettings.md) |

**Returns:** *Promise‹void›*

___

### `Const` getEventsFromBlock

▸ **getEventsFromBlock**(`block`: BigNumber, `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `provider`: JsonRpcProvider, `resolverSettings`: [IResolverSettings](interfaces/iresolversettings.md)): *Promise‹unknown›*

*Defined in [did-resolver/src/functions/index.ts:161](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L161)*

**Parameters:**

Name | Type |
------ | ------ |
`block` | BigNumber |
`did` | string |
`document` | [IDIDLogData](interfaces/ididlogdata.md) |
`provider` | JsonRpcProvider |
`resolverSettings` | [IResolverSettings](interfaces/iresolversettings.md) |

**Returns:** *Promise‹unknown›*

___

### `Const` handleAttributeChange

▸ **handleAttributeChange**(`event`: [ISmartContractEvent](interfaces/ismartcontractevent.md), `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `validTo`: BigNumber): *[IDIDLogData](interfaces/ididlogdata.md)*

*Defined in [did-resolver/src/functions/index.ts:53](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [ISmartContractEvent](interfaces/ismartcontractevent.md) |
`did` | string |
`document` | [IDIDLogData](interfaces/ididlogdata.md) |
`validTo` | BigNumber |

**Returns:** *[IDIDLogData](interfaces/ididlogdata.md)*

___

### `Const` handleDelegateChange

▸ **handleDelegateChange**(`event`: [ISmartContractEvent](interfaces/ismartcontractevent.md), `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `validTo`: BigNumber): *[IDIDLogData](interfaces/ididlogdata.md)*

*Defined in [did-resolver/src/functions/index.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [ISmartContractEvent](interfaces/ismartcontractevent.md) |
`did` | string |
`document` | [IDIDLogData](interfaces/ididlogdata.md) |
`validTo` | BigNumber |

**Returns:** *[IDIDLogData](interfaces/ididlogdata.md)*

___

### `Const` sha256

▸ **sha256**(`data`: string): *string*

*Defined in [keys/src/functions/index.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/keys/src/functions/index.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*

___

### `Const` updateDocument

▸ **updateDocument**(`event`: [ISmartContractEvent](interfaces/ismartcontractevent.md), `eventName`: string, `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md)): *[IDIDLogData](interfaces/ididlogdata.md)*

*Defined in [did-resolver/src/functions/index.ts:145](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [ISmartContractEvent](interfaces/ismartcontractevent.md) |
`eventName` | string |
`did` | string |
`document` | [IDIDLogData](interfaces/ididlogdata.md) |

**Returns:** *[IDIDLogData](interfaces/ididlogdata.md)*

___

### `Const` wrapDidDocument

▸ **wrapDidDocument**(`did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `context`: string): *[IDIDDocument](interfaces/ididdocument.md)*

*Defined in [did-resolver/src/functions/index.ts:234](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L234)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`did` | string | - |
`document` | [IDIDLogData](interfaces/ididlogdata.md) | - |
`context` | string | "https://www.w3.org/ns/did/v1" |

**Returns:** *[IDIDDocument](interfaces/ididdocument.md)*

## Object literals

### `Const` DID_SCHEME_PATTERNS

### ▪ **DID_SCHEME_PATTERNS**: *object*

*Defined in [did/src/models/index.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did/src/models/index.ts#L10)*

###  ID

• **ID**: *RegExp‹›* =  /^[\w.-]*(:[\w.-]*)*$/

*Defined in [did/src/models/index.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did/src/models/index.ts#L19)*

DID specification rule for method-specific-id
DID specification rule for method-name
The pattern allows an empty identifier to identify a method or did-registry
See [Issue 34] [https://github.com/w3c/did-core/issues/34](https://github.com/w3c/did-core/issues/34)

###  NETWORK

• **NETWORK**: *RegExp‹›* =  /^[a-z0-9]+$/

*Defined in [did/src/models/index.ts:12](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did/src/models/index.ts#L12)*

___

### `Const` ECDSA_PATTERNS

### ▪ **ECDSA_PATTERNS**: *object*

*Defined in [keys/src/models/index.ts:6](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/keys/src/models/index.ts#L6)*

▪ **secp256k1**: *object*

*Defined in [keys/src/models/index.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/keys/src/models/index.ts#L7)*

* **PRIVATE_KEY**: *RegExp‹›* =  /^[a-f0-9]{64}$/

* **PUBLIC_KEY**: *RegExp‹›* =  /^[a-f0-9]{66}$/

* **SIGNATURE**: *RegExp‹›* =  /^[a-f0-9]{128}$/

___

### `Const` defaultProvider

### ▪ **defaultProvider**: *object*

*Defined in [did-resolver/src/constants/index.ts:244](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L244)*

###  type

• **type**: *[ProviderTypes](enums/providertypes.md)* =  ProviderTypes.HTTP

*Defined in [did-resolver/src/constants/index.ts:246](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L246)*

###  uriOrInfo

• **uriOrInfo**: *string* = "http://volta-rpc.energyweb.org/"

*Defined in [did-resolver/src/constants/index.ts:245](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L245)*

___

### `Const` defaultResolverSettings

### ▪ **defaultResolverSettings**: *object*

*Defined in [did-resolver/src/constants/index.ts:249](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L249)*

###  abi

• **abi**: *object | object[]* =  abi1056

*Defined in [did-resolver/src/constants/index.ts:251](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L251)*

###  address

• **address**: *string* =  address1056

*Defined in [did-resolver/src/constants/index.ts:252](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L252)*

###  provider

• **provider**: *object* =  defaultProvider

*Defined in [did-resolver/src/constants/index.ts:250](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/constants/index.ts#L250)*

#### Type declaration:

* **type**: *[ProviderTypes](enums/providertypes.md)* =  ProviderTypes.HTTP

* **uriOrInfo**: *string* = "http://volta-rpc.energyweb.org/"

___

### `Const` handlers

### ▪ **handlers**: *object*

*Defined in [did-resolver/src/functions/index.ts:140](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L140)*

###  DIDAttributeChanged

• **DIDAttributeChanged**: *[handleAttributeChange](undefined)* =  handleAttributeChange

*Defined in [did-resolver/src/functions/index.ts:142](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L142)*

###  DIDDelegateChanged

• **DIDDelegateChanged**: *[handleDelegateChange](undefined)* =  handleDelegateChange

*Defined in [did-resolver/src/functions/index.ts:141](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/functions/index.ts#L141)*

___

### `Const` hex

### ▪ **hex**: *object*

*Defined in [keys/src/functions/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/keys/src/functions/index.ts#L3)*

###  encode

▸ **encode**(`data`: string): *string*

*Defined in [keys/src/functions/index.ts:4](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/keys/src/functions/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*
