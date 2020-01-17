[@ew-did-registry/did - v1.0.0](../README.md) › [Globals](../globals.md) › [Keys](keys.md)

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

### Methods

* [decrypt](keys.md#decrypt)
* [encrypt](keys.md#encrypt)
* [sign](keys.md#sign)
* [verify](keys.md#verify)
* [generateKeyPair](keys.md#static-generatekeypair)

## Constructors

###  constructor

\+ **new Keys**(`__namedParameters`: object): *[Keys](keys.md)*

*Defined in [keys/src/index.ts:23](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L23)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*=  {}

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string | - |
`publicKey` | string |   |

**Returns:** *[Keys](keys.md)*

## Properties

###  privateKey

• **privateKey**: *string*

*Implementation of [IKeys](../interfaces/ikeys.md).[privateKey](../interfaces/ikeys.md#privatekey)*

*Defined in [keys/src/index.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L18)*

Private Key of secp256k1

___

###  publicKey

• **publicKey**: *string*

*Implementation of [IKeys](../interfaces/ikeys.md).[publicKey](../interfaces/ikeys.md#publickey)*

*Defined in [keys/src/index.ts:23](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L23)*

Public Key of secp256k1

## Methods

###  decrypt

▸ **decrypt**(`encrypted`: string, `publicKey?`: string): *Promise‹string›*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:68](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L68)*

Decrypt the encrypted data that is given in hex format

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';

const keysAlice = new Keys();
const keysBob = new Keys();
const data = 'test';
const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
const decrypted = await keysBob.decrypt(encrypted);
console.log(decrypted); // 'test'
```

**Parameters:**

Name | Type |
------ | ------ |
`encrypted` | string |
`publicKey?` | string |

**Returns:** *Promise‹string›*

___

###  encrypt

▸ **encrypt**(`data`: string, `publicKeyTo?`: string): *Promise‹string›*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:93](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L93)*

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

Name | Type |
------ | ------ |
`data` | string |
`publicKeyTo?` | string |

**Returns:** *Promise‹string›*

___

###  sign

▸ **sign**(`data`: string, `privateKey?`: string): *string*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:124](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L124)*

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

**Returns:** *string*

___

###  verify

▸ **verify**(`data`: string, `signature`: string, `publicKey?`: string): *boolean*

*Implementation of [IKeys](../interfaces/ikeys.md)*

*Defined in [keys/src/index.ts:158](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L158)*

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

___

### `Static` generateKeyPair

▸ **generateKeyPair**(): *[KeyPair](../interfaces/keypair.md)*

*Defined in [keys/src/index.ts:185](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/keys/src/index.ts#L185)*

Generates new key pair for secp256k1 algorithm.

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';

const keyPair = Keys.generateKeyPair();
console.log(keyPair.privateKey) // 64 hex symbols string
console.log(keyPair.publicKey) // 66 hex symbols string
```

**Returns:** *[KeyPair](../interfaces/keypair.md)*
