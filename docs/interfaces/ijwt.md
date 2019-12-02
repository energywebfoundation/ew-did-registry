[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IJWT](ijwt.md)

# Interface: IJWT

The JWT exposes methods to create/sign, verify, and decode JSON web tokens

## Hierarchy

* **IJWT**

## Index

### Methods

* [decode](ijwt.md#decode)
* [sign](ijwt.md#sign)
* [verify](ijwt.md#verify)

## Methods

###  decode

▸ **decode**(`token`: string, `options?`: object): *object*

*Defined in [jwt/src/interface.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/573253b/packages/jwt/src/interface.ts#L32)*

Method decodes JWT without checking the signature. This can be useful in cases,
where Public Key of the signer is yet to be retrieved using claim data stored in JWT.
Decoded JSON web token is returned.

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`options?` | object |

**Returns:** *object*

___

###  sign

▸ **sign**(`payload`: object, `options?`: object): *Promise‹string›*

*Defined in [jwt/src/interface.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/573253b/packages/jwt/src/interface.ts#L11)*

Method accepts claim payload and options, and returns a string Promise

**Parameters:**

Name | Type |
------ | ------ |
`payload` | object |
`options?` | object |

**Returns:** *Promise‹string›*

___

###  verify

▸ **verify**(`token`: string, `publicKey`: string, `options?`: object): *Promise‹object›*

*Defined in [jwt/src/interface.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/573253b/packages/jwt/src/interface.ts#L22)*

Method accepts the token, publicKey of signing entity, as well as options
Decoded JWT is returned in the Promise, if the signature is correct, otherwise
an error will be thrown

**Parameters:**

Name | Type |
------ | ------ |
`token` | string |
`publicKey` | string |
`options?` | object |

**Returns:** *Promise‹object›*
