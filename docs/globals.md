[@ew-did-registry/claims](README.md) › [Globals](globals.md)

# @ew-did-registry/claims

## Index

### Enumerations

* [Algorithms](enums/algorithms.md)
* [Attributes](enums/attributes.md)
* [DIDAttribute](enums/didattribute.md)
* [DelegateTypes](enums/delegatetypes.md)
* [Encoding](enums/encoding.md)
* [Networks](enums/networks.md)
* [ProviderTypes](enums/providertypes.md)
* [PubKeyType](enums/pubkeytype.md)

### Classes

* [Claims](classes/claims.md)
* [ClaimsFactory](classes/claimsfactory.md)
* [ClaimsIssuer](classes/claimsissuer.md)
* [ClaimsUser](classes/claimsuser.md)
* [ClaimsVerifier](classes/claimsverifier.md)
* [DID](classes/did.md)
* [DIDDocumentFactory](classes/diddocumentfactory.md)
* [DIDDocumentFull](classes/diddocumentfull.md)
* [DIDDocumentLite](classes/diddocumentlite.md)
* [DIDRegistry](classes/didregistry.md)
* [JWT](classes/jwt.md)
* [Keys](classes/keys.md)
* [Operator](classes/operator.md)
* [Resolver](classes/resolver.md)

### Interfaces

* [IAuthentication](interfaces/iauthentication.md)
* [IClaims](interfaces/iclaims.md)
* [IClaimsFactory](interfaces/iclaimsfactory.md)
* [IClaimsIssuer](interfaces/iclaimsissuer.md)
* [IClaimsUser](interfaces/iclaimsuser.md)
* [IClaimsVerifier](interfaces/iclaimsverifier.md)
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
* [IProofClaim](interfaces/iproofclaim.md)
* [IProofData](interfaces/iproofdata.md)
* [IProvider](interfaces/iprovider.md)
* [IPublicClaim](interfaces/ipublicclaim.md)
* [IPublicKey](interfaces/ipublickey.md)
* [IResolver](interfaces/iresolver.md)
* [IResolverSettings](interfaces/iresolversettings.md)
* [ISaltedFields](interfaces/isaltedfields.md)
* [IServiceEndpoint](interfaces/iserviceendpoint.md)
* [ISmartContractEvent](interfaces/ismartcontractevent.md)
* [IUpdateData](interfaces/iupdatedata.md)
* [IUpdateParameters](interfaces/iupdateparameters.md)
* [KeyPair](interfaces/keypair.md)

### Variables

* [Authenticate](globals.md#authenticate)
* [PublicKey](globals.md#publickey)
* [ServicePoint](globals.md#servicepoint)
* [abi1056](globals.md#const-abi1056)
* [address1056](globals.md#const-address1056)
* [bitArray](globals.md#bitarray)
* [bn](globals.md#bn)
* [delegatePubKeyIdPattern](globals.md#const-delegatepubkeyidpattern)
* [ec](globals.md#const-ec)
* [ethAddrPattern](globals.md#const-ethaddrpattern)
* [fail](globals.md#fail)
* [hash](globals.md#hash)
* [keyEncoder](globals.md#const-keyencoder)
* [keyPairAlice](globals.md#let-keypairalice)
* [matchingPatternDid](globals.md#const-matchingpatterndid)
* [matchingPatternDidEvents](globals.md#const-matchingpatterndidevents)
* [payload](globals.md#let-payload)
* [pubKeyIdPattern](globals.md#const-pubkeyidpattern)
* [serviceIdPattern](globals.md#const-serviceidpattern)
* [token](globals.md#let-token)

### Functions

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

###  Authenticate

• **Authenticate**: *[Authenticate](enums/didattribute.md#authenticate)*

Defined in did-resolver/src/implementations/operator.ts:26

___

###  PublicKey

• **PublicKey**: *[PublicKey](enums/didattribute.md#publickey)*

Defined in did-resolver/src/implementations/operator.ts:26

___

###  ServicePoint

• **ServicePoint**: *[ServicePoint](enums/didattribute.md#servicepoint)*

Defined in did-resolver/src/implementations/operator.ts:26

___

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

Defined in did-resolver/src/constants/constants.ts:7

___

### `Const` address1056

• **address1056**: *"0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af"* = "0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af"

Defined in did-resolver/src/constants/constants.ts:4

___

###  bitArray

• **bitArray**: *any*

Defined in claims/src/claimsUser/claimsUser.ts:19

___

###  bn

• **bn**: *any*

Defined in claims/src/claimsUser/claimsUser.ts:19

Defined in claims/src/claimsIssuer/claimsIssuer.ts:11

Defined in claims/src/claimsVerifier/claimsVerifier.ts:14

___

### `Const` delegatePubKeyIdPattern

• **delegatePubKeyIdPattern**: *string* =  `^did:ewc:${ethAddrPattern}#delegate-(sigAuth|veriKey)-(${ethAddrPattern})$`

Defined in did-resolver/src/constants/constants.ts:268

___

### `Const` ec

• **ec**: *ec‹›* =  new EC('secp256k1')

Defined in keys/src/index.ts:10

___

### `Const` ethAddrPattern

• **ethAddrPattern**: *"0x[A-Fa-f0-9]{40}"* = "0x[A-Fa-f0-9]{40}"

Defined in did-resolver/src/constants/constants.ts:267

___

###  fail

• **fail**: *fail*

Defined in did-resolver/test/did-operator.test.ts:15

___

###  hash

• **hash**: *any*

Defined in claims/src/claimsUser/claimsUser.ts:19

Defined in claims/src/claimsVerifier/claimsVerifier.ts:14

___

### `Const` keyEncoder

• **keyEncoder**: *KeyEncoder‹›* =  new KeyEncoder('secp256k1')

Defined in jwt/src/index.ts:7

___

### `Let` keyPairAlice

• **keyPairAlice**: *IKeys*

Defined in jwt/test/jwt.test.ts:8

___

### `Const` matchingPatternDid

• **matchingPatternDid**: *RegExp‹›* =  /did:[a-z0-9]+:0x[A-Za-z0-9]{40}/

Defined in did-resolver/src/constants/constants.ts:266

___

### `Const` matchingPatternDidEvents

• **matchingPatternDidEvents**: *RegExp‹›* =  /^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/

Defined in did-resolver/src/constants/constants.ts:265

___

### `Let` payload

• **payload**: *object*

Defined in jwt/test/jwt.test.ts:6

___

### `Const` pubKeyIdPattern

• **pubKeyIdPattern**: *string* =  `^did:ewc:${ethAddrPattern}#key-([A-Za-z0-9]*)(sigAuth|veriKey)`

Defined in did-resolver/src/constants/constants.ts:269

___

### `Const` serviceIdPattern

• **serviceIdPattern**: *string* =  `^did:ewc:${ethAddrPattern}#service-([A-Za-z0-9]+)-([A-Za-z0-9]+)$`

Defined in did-resolver/src/constants/constants.ts:270

___

### `Let` token

• **token**: *string*

Defined in jwt/test/jwt.test.ts:7

## Functions

### `Const` fetchDataFromEvents

▸ **fetchDataFromEvents**(`did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `resolverSettings`: [IResolverSettings](interfaces/iresolversettings.md), `contract`: Contract, `provider`: BaseProvider): *Promise‹void›*

Defined in did-resolver/src/functions/functions.ts:252

A high level function that manages the flow to read data from the blockchain

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string | - |
`document` | [IDIDLogData](interfaces/ididlogdata.md) | - |
`resolverSettings` | [IResolverSettings](interfaces/iresolversettings.md) | - |
`contract` | Contract | - |
`provider` | BaseProvider |   |

**Returns:** *Promise‹void›*

___

### `Const` getEventsFromBlock

▸ **getEventsFromBlock**(`block`: BigNumber, `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `provider`: BaseProvider, `smartContractInterface`: Interface, `smartContractAddress`: string): *Promise‹unknown›*

Defined in did-resolver/src/functions/functions.ts:216

Given a certain block from the chain, this function returns the events
associated with the did within the block

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`block` | BigNumber | - |
`did` | string | - |
`document` | [IDIDLogData](interfaces/ididlogdata.md) | - |
`provider` | BaseProvider | - |
`smartContractInterface` | Interface | - |
`smartContractAddress` | string |   |

**Returns:** *Promise‹unknown›*

___

### `Const` handleAttributeChange

▸ **handleAttributeChange**(`event`: [ISmartContractEvent](interfaces/ismartcontractevent.md), `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `validTo`: BigNumber, `block`: number): *[IDIDLogData](interfaces/ididlogdata.md)*

Defined in did-resolver/src/functions/functions.ts:74

This function updates the document on Attribute change event

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [ISmartContractEvent](interfaces/ismartcontractevent.md) | - |
`did` | string | - |
`document` | [IDIDLogData](interfaces/ididlogdata.md) | - |
`validTo` | BigNumber | - |
`block` | number |   |

**Returns:** *[IDIDLogData](interfaces/ididlogdata.md)*

___

### `Const` handleDelegateChange

▸ **handleDelegateChange**(`event`: [ISmartContractEvent](interfaces/ismartcontractevent.md), `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `validTo`: BigNumber, `block`: number): *[IDIDLogData](interfaces/ididlogdata.md)*

Defined in did-resolver/src/functions/functions.ts:28

This function updates the document if the event type is 'DelegateChange'

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [ISmartContractEvent](interfaces/ismartcontractevent.md) | - |
`did` | string | - |
`document` | [IDIDLogData](interfaces/ididlogdata.md) | - |
`validTo` | BigNumber | - |
`block` | number |   |

**Returns:** *[IDIDLogData](interfaces/ididlogdata.md)*

___

### `Const` sha256

▸ **sha256**(`data`: string): *string*

Defined in keys/src/functions/index.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*

___

### `Const` updateDocument

▸ **updateDocument**(`event`: [ISmartContractEvent](interfaces/ismartcontractevent.md), `eventName`: string, `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `block`: number): *[IDIDLogData](interfaces/ididlogdata.md)*

Defined in did-resolver/src/functions/functions.ts:188

Update document checks the event validity, and, if valid,
passes the event parsing to the handler

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [ISmartContractEvent](interfaces/ismartcontractevent.md) | - |
`eventName` | string | - |
`did` | string | - |
`document` | [IDIDLogData](interfaces/ididlogdata.md) | - |
`block` | number |   |

**Returns:** *[IDIDLogData](interfaces/ididlogdata.md)*

___

### `Const` wrapDidDocument

▸ **wrapDidDocument**(`did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `context`: string): *[IDIDDocument](interfaces/ididdocument.md)*

Defined in did-resolver/src/functions/functions.ts:303

Provided with the fetched data, the function parses it and returns the
DID Document associated with the relevant user

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`did` | string | - | - |
`document` | [IDIDLogData](interfaces/ididlogdata.md) | - | - |
`context` | string | "https://www.w3.org/ns/did/v1" |   |

**Returns:** *[IDIDDocument](interfaces/ididdocument.md)*

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

### `Const` defaultProvider

### ▪ **defaultProvider**: *object*

Defined in did-resolver/src/constants/constants.ts:247

###  type

• **type**: *[ProviderTypes](enums/providertypes.md)* =  ProviderTypes.HTTP

Defined in did-resolver/src/constants/constants.ts:250

###  uriOrInfo

• **uriOrInfo**: *string* = "http://volta-rpc.energyweb.org/"

Defined in did-resolver/src/constants/constants.ts:248

___

### `Const` defaultResolverSettings

### ▪ **defaultResolverSettings**: *object*

Defined in did-resolver/src/constants/constants.ts:258

The three above comprise the minimal settings for resolver.
One can adjust them to use the resolver with a different provider
or with a different smart contract.

###  abi

• **abi**: *object | object[]* =  abi1056

Defined in did-resolver/src/constants/constants.ts:260

###  address

• **address**: *string* =  address1056

Defined in did-resolver/src/constants/constants.ts:261

###  provider

• **provider**: *object* =  defaultProvider

Defined in did-resolver/src/constants/constants.ts:259

#### Type declaration:

* **type**: *[ProviderTypes](enums/providertypes.md)* =  ProviderTypes.HTTP

* **uriOrInfo**: *string* = "http://volta-rpc.energyweb.org/"

___

### `Const` handlers

### ▪ **handlers**: *object*

Defined in did-resolver/src/functions/functions.ts:173

Simply a handler for delegate vs attribute change

###  DIDAttributeChanged

• **DIDAttributeChanged**: *handleAttributeChange* =  handleAttributeChange

Defined in did-resolver/src/functions/functions.ts:175

###  DIDDelegateChanged

• **DIDDelegateChanged**: *handleDelegateChange* =  handleDelegateChange

Defined in did-resolver/src/functions/functions.ts:174

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
