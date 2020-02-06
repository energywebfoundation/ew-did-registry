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

*Defined in [did-resolver/src/implementations/operator.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/implementations/operator.ts#L26)*

___

###  PublicKey

• **PublicKey**: *[PublicKey](enums/didattribute.md#publickey)*

*Defined in [did-resolver/src/implementations/operator.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/implementations/operator.ts#L26)*

___

###  ServicePoint

• **ServicePoint**: *[ServicePoint](enums/didattribute.md#servicepoint)*

*Defined in [did-resolver/src/implementations/operator.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/implementations/operator.ts#L26)*

___

### `Const` abi1056

• **abi1056**: *any* =  (ethrJson as any).abi

*Defined in [did-resolver/src/constants/constants.ts:8](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L8)*

___

### `Const` address1056

• **address1056**: *"0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0"* = "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0"

*Defined in [did-resolver/src/constants/constants.ts:5](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L5)*

___

###  bitArray

• **bitArray**: *any*

*Defined in [claims/src/claimsUser/claimsUser.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/claims/src/claimsUser/claimsUser.ts#L19)*

___

###  bn

• **bn**: *any*

*Defined in [claims/src/claimsUser/claimsUser.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/claims/src/claimsUser/claimsUser.ts#L19)*

*Defined in [claims/src/claimsIssuer/claimsIssuer.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/claims/src/claimsIssuer/claimsIssuer.ts#L11)*

*Defined in [claims/src/claimsVerifier/claimsVerifier.ts:14](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/claims/src/claimsVerifier/claimsVerifier.ts#L14)*

___

### `Const` delegatePubKeyIdPattern

• **delegatePubKeyIdPattern**: *string* =  `^did:ewc:${ethAddrPattern}#delegate-(sigAuth|veriKey)-(${ethAddrPattern})$`

*Defined in [did-resolver/src/constants/constants.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L32)*

___

### `Const` ec

• **ec**: *ec‹›* =  new EC('secp256k1')

*Defined in [keys/src/index.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/keys/src/index.ts#L10)*

___

### `Const` ethAddrPattern

• **ethAddrPattern**: *"0x[A-Fa-f0-9]{40}"* = "0x[A-Fa-f0-9]{40}"

*Defined in [did-resolver/src/constants/constants.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L31)*

___

###  fail

• **fail**: *fail*

*Defined in [did-resolver/test/did-operator.test.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/test/did-operator.test.ts#L18)*

___

###  hash

• **hash**: *any*

*Defined in [claims/src/claimsUser/claimsUser.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/claims/src/claimsUser/claimsUser.ts#L19)*

*Defined in [claims/src/claimsVerifier/claimsVerifier.ts:14](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/claims/src/claimsVerifier/claimsVerifier.ts#L14)*

___

### `Const` keyEncoder

• **keyEncoder**: *KeyEncoder‹›* =  new KeyEncoder('secp256k1')

*Defined in [jwt/src/index.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/jwt/src/index.ts#L7)*

___

### `Let` keyPairAlice

• **keyPairAlice**: *IKeys*

*Defined in [jwt/test/jwt.test.ts:8](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/jwt/test/jwt.test.ts#L8)*

___

### `Const` matchingPatternDid

• **matchingPatternDid**: *RegExp‹›* =  /did:[a-z0-9]+:0x[A-Za-z0-9]{40}/

*Defined in [did-resolver/src/constants/constants.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L30)*

___

### `Const` matchingPatternDidEvents

• **matchingPatternDidEvents**: *RegExp‹›* =  /^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/

*Defined in [did-resolver/src/constants/constants.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L29)*

___

### `Let` payload

• **payload**: *object*

*Defined in [jwt/test/jwt.test.ts:6](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/jwt/test/jwt.test.ts#L6)*

___

### `Const` pubKeyIdPattern

• **pubKeyIdPattern**: *string* =  `^did:ewc:${ethAddrPattern}#key-([A-Za-z0-9]*)(sigAuth|veriKey)`

*Defined in [did-resolver/src/constants/constants.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L33)*

___

### `Const` serviceIdPattern

• **serviceIdPattern**: *string* =  `^did:ewc:${ethAddrPattern}#service-([A-Za-z0-9]+)-([A-Za-z0-9]+)$`

*Defined in [did-resolver/src/constants/constants.ts:34](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L34)*

___

### `Let` token

• **token**: *string*

*Defined in [jwt/test/jwt.test.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/jwt/test/jwt.test.ts#L7)*

## Functions

### `Const` fetchDataFromEvents

▸ **fetchDataFromEvents**(`did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `resolverSettings`: [IResolverSettings](interfaces/iresolversettings.md), `contract`: Contract, `provider`: BaseProvider): *Promise‹void›*

*Defined in [did-resolver/src/functions/functions.ts:250](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L250)*

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

*Defined in [did-resolver/src/functions/functions.ts:214](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L214)*

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

*Defined in [did-resolver/src/functions/functions.ts:72](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L72)*

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

*Defined in [did-resolver/src/functions/functions.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L26)*

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

*Defined in [keys/src/functions/index.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/keys/src/functions/index.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*

___

### `Const` updateDocument

▸ **updateDocument**(`event`: [ISmartContractEvent](interfaces/ismartcontractevent.md), `eventName`: string, `did`: string, `document`: [IDIDLogData](interfaces/ididlogdata.md), `block`: number): *[IDIDLogData](interfaces/ididlogdata.md)*

*Defined in [did-resolver/src/functions/functions.ts:186](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L186)*

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

*Defined in [did-resolver/src/functions/functions.ts:301](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L301)*

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

*Defined in [did/src/models/index.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did/src/models/index.ts#L10)*

###  ID

• **ID**: *RegExp‹›* =  /^[\w.-]*(:[\w.-]*)*$/

*Defined in [did/src/models/index.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did/src/models/index.ts#L19)*

DID specification rule for method-specific-id
DID specification rule for method-name
The pattern allows an empty identifier to identify a method or did-registry
See [Issue 34] [https://github.com/w3c/did-core/issues/34](https://github.com/w3c/did-core/issues/34)

###  NETWORK

• **NETWORK**: *RegExp‹›* =  /^[a-z0-9]+$/

*Defined in [did/src/models/index.ts:12](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did/src/models/index.ts#L12)*

___

### `Const` ECDSA_PATTERNS

### ▪ **ECDSA_PATTERNS**: *object*

*Defined in [keys/src/models/index.ts:6](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/keys/src/models/index.ts#L6)*

▪ **secp256k1**: *object*

*Defined in [keys/src/models/index.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/keys/src/models/index.ts#L7)*

* **PRIVATE_KEY**: *RegExp‹›* =  /^[a-f0-9]{64}$/

* **PUBLIC_KEY**: *RegExp‹›* =  /^[a-f0-9]{66}$/

* **SIGNATURE**: *RegExp‹›* =  /^[a-f0-9]{128}$/

___

### `Const` defaultProvider

### ▪ **defaultProvider**: *object*

*Defined in [did-resolver/src/constants/constants.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L11)*

###  type

• **type**: *[ProviderTypes](enums/providertypes.md)* =  ProviderTypes.HTTP

*Defined in [did-resolver/src/constants/constants.ts:14](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L14)*

###  uriOrInfo

• **uriOrInfo**: *string* = "http://localhost:8544"

*Defined in [did-resolver/src/constants/constants.ts:13](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L13)*

___

### `Const` defaultResolverSettings

### ▪ **defaultResolverSettings**: *object*

*Defined in [did-resolver/src/constants/constants.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L22)*

The three above comprise the minimal settings for resolver.
One can adjust them to use the resolver with a different provider
or with a different smart contract.

###  abi

• **abi**: *any* =  abi1056

*Defined in [did-resolver/src/constants/constants.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L24)*

###  address

• **address**: *string* =  address1056

*Defined in [did-resolver/src/constants/constants.ts:25](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L25)*

###  provider

• **provider**: *object* =  defaultProvider

*Defined in [did-resolver/src/constants/constants.ts:23](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/constants/constants.ts#L23)*

#### Type declaration:

* **type**: *[ProviderTypes](enums/providertypes.md)* =  ProviderTypes.HTTP

* **uriOrInfo**: *string* = "http://localhost:8544"

___

### `Const` handlers

### ▪ **handlers**: *object*

*Defined in [did-resolver/src/functions/functions.ts:171](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L171)*

Simply a handler for delegate vs attribute change

###  DIDAttributeChanged

• **DIDAttributeChanged**: *handleAttributeChange* =  handleAttributeChange

*Defined in [did-resolver/src/functions/functions.ts:173](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L173)*

###  DIDDelegateChanged

• **DIDDelegateChanged**: *handleDelegateChange* =  handleDelegateChange

*Defined in [did-resolver/src/functions/functions.ts:172](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/functions/functions.ts#L172)*

___

### `Const` hex

### ▪ **hex**: *object*

*Defined in [keys/src/functions/index.ts:3](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/keys/src/functions/index.ts#L3)*

###  encode

▸ **encode**(`data`: string): *string*

*Defined in [keys/src/functions/index.ts:4](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/keys/src/functions/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |

**Returns:** *string*
