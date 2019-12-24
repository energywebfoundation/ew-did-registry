[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [IUpdateData](iupdatedata.md)

# Interface: IUpdateData

Data used to update DID Document. To update the public key you need to set its value in value
field, and to set authentication method, the delegate ethereum address must be set in the
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

Defined in did-resolver/src/models/operator.ts:43

___

### `Optional` delegate

• **delegate**? : *string*

Defined in did-resolver/src/models/operator.ts:46

___

###  encoding

• **encoding**: *[Encoding](../enums/encoding.md)*

Defined in did-resolver/src/models/operator.ts:42

___

###  type

• **type**: *[PubKeyType](../enums/pubkeytype.md)*

Defined in did-resolver/src/models/operator.ts:44

___

### `Optional` value

• **value**? : *string*

Defined in did-resolver/src/models/operator.ts:45
