[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IUpdateData](iupdatedata.md)

# Interface: IUpdateData

Data used to update DID Document. To update the public key you need to set its value in value
field, and to set authentication method, the delegate's Ethereum address must be set in the
delegate field

## Hierarchy

* **IUpdateData**

## Index

### Properties

* [algo](iupdatedata.md#algo)
* [delegate](iupdatedata.md#optional-delegate)
* [encoding](iupdatedata.md#encoding)
* [type](iupdatedata.md#type)
* [value](iupdatedata.md#optional-value)

## Properties

###  algo

• **algo**: *[Algorithms](../enums/algorithms.md)*

*Defined in [did-resolver/src/models/operator.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/did-resolver/src/models/operator.ts#L36)*

___

### `Optional` delegate

• **delegate**? : *string*

*Defined in [did-resolver/src/models/operator.ts:39](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/did-resolver/src/models/operator.ts#L39)*

___

###  encoding

• **encoding**: *[Encoding](../enums/encoding.md)*

*Defined in [did-resolver/src/models/operator.ts:35](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/did-resolver/src/models/operator.ts#L35)*

___

###  type

• **type**: *[PubKeyType](../enums/pubkeytype.md)*

*Defined in [did-resolver/src/models/operator.ts:37](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/did-resolver/src/models/operator.ts#L37)*

___

### `Optional` value

• **value**? : *string*

*Defined in [did-resolver/src/models/operator.ts:38](https://github.com/energywebfoundation/ew-did-registry/blob/5f4bc4b/packages/did-resolver/src/models/operator.ts#L38)*
