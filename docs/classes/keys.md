[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [Keys](keys.md)

# Class: Keys

## Hierarchy

* **Keys**

## Implements

* [IKeys](../interfaces/ikeys.md)

## Index

### Constructors

* [constructor](keys.md#constructor)

### Properties

* [privateKey](keys.md#privatekey)
* [publicKey](keys.md#publickey)

### Accessors

* [address](keys.md#address)

### Methods

* [decrypt](keys.md#decrypt)
* [encrypt](keys.md#encrypt)
* [getAddress](keys.md#getaddress)
* [sign](keys.md#sign)
* [verify](keys.md#verify)
* [generateKeyPair](keys.md#static-generatekeypair)

## Constructors

###  constructor

\+ **new Keys**(`__namedParameters`: object): *[Keys](keys.md)*

*Defined in [keys/src/index.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L24)*

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string | - |
`publicKey` | string |   |

**Returns:** *[Keys](keys.md)*

## Properties

###  privateKey

• **privateKey**: *string*

*Implementation of [IKeys](../interfaces/ikeys.md).[privateKey](../interfaces/ikeys.md#privatekey)*

*Defined in [keys/src/index.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L19)*

Private Key of secp256k1

*Defined in [keys/src/index.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L19)*

*Implementation of [IKeys](../interfaces/ikeys.md).[publicKey](../interfaces/ikeys.md#publickey)*

*Defined in [keys/src/index.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L24)*

Public Key of secp256k1

## Accessors

###  address

*Defined in [keys/src/index.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L24)*

## Methods

###  decrypt

▸ **decrypt**(`encrypted`: string, `publicKey?`: string): *Promise‹string›*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:73](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L73)*

Decrypt the encrypted data that is given in hex format

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';

const keysAlice = new Keys();
const keysBob = new Keys();
const data = 'test';
const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
*Defined in [keys/src/index.ts:73](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L73)*

Name | Type |
------ | ------ |
`encrypted` | string |
`publicKey?` | string |

**Returns:** *Promise‹string›*

___

###  encrypt

▸ **encrypt**(`data`: string, `publicKeyTo?`: string): *Promise‹string›*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:98](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L98)*

Encrypt the data that is given in utf-8 string

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';

const keysAlice = new Keys();
const keysBob = new Keys();
const data = 'test';
const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
console.log(encrypted); // hex symbols string
```

**Parameters:**
*Defined in [keys/src/index.ts:98](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L98)*

**Returns:** *Promise‹string›*

___

###  getAddress

▸ **getAddress**(): *string*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L50)*

**Returns:** *string*

___

###  sign

▸ **sign**(`data`: string, `privateKey?`: string): *string*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:129](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L129)*

Sign the data

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';

const keys = new Keys();
const data = 'test';
const signature = keys.sign(data);
console.log(signature); // 128 hex symbols string
```

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`privateKey?` | string |
*Defined in [keys/src/index.ts:129](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L129)*
###  verify

▸ **verify**(`data`: string, `signature`: string, `publicKey?`: string): *boolean*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:163](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L163)*

Verify the signature

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';

const keys = new Keys();
const data = 'test';
const signature = keys.sign(data);
console.log(keys.verify(signature)); // true
```

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`signature` | string |
`publicKey?` | string |

**Returns:** *boolean*

*Defined in [keys/src/index.ts:163](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L163)*

*Defined in [keys/src/index.ts:190](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L190)*

Generates new key pair for secp256k1 algorithm.

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';

const keyPair = Keys.generateKeyPair();
console.log(keyPair.privateKey) // 64 hex symbols string
console.log(keyPair.publicKey) // 66 hex symbols string
```

**Returns:** *[KeyPair](../interfaces/keypair.md)*
*Defined in [keys/src/index.ts:190](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/keys/src/index.ts#L190)*
