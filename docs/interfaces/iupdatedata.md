[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IUpdateData](iupdatedata.md)

# Interface: IUpdateData

Data used to update DID Document. To update the public key you need to set its value in value
field, and to set authentication method, the delegate's Ethereum address must be set in the
delegate field

## Hierarchy

* **IUpdateData**

## Index

### Properties

* [algo](iupdatedata.md#optional-algo)
* [delegate](iupdatedata.md#optional-delegate)
* [encoding](iupdatedata.md#optional-encoding)
* [type](iupdatedata.md#type)
* [value](iupdatedata.md#optional-value)

## Properties

### `Optional` algo

• **algo**? : *[Algorithms](../enums/algorithms.md)*

Defined in did-resolver/src/models/operator.ts:36

___

### `Optional` delegate

• **delegate**? : *string*

Defined in did-resolver/src/models/operator.ts:39

___

### `Optional` encoding

• **encoding**? : *[Encoding](../enums/encoding.md)*

Defined in did-resolver/src/models/operator.ts:35

___

###  type

• **type**: *[PubKeyType](../enums/pubkeytype.md)*

Defined in did-resolver/src/models/operator.ts:37

___

### `Optional` value

• **value**? : *string*

Defined in did-resolver/src/models/operator.ts:38
