[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [ISmartContractEvent](ismartcontractevent.md)

# Interface: ISmartContractEvent

This interface represents the structure of event emitted by ERC1056 compliant smart contract.

## Hierarchy

* **ISmartContractEvent**

## Index

### Properties

* [name](ismartcontractevent.md#name)
* [signature](ismartcontractevent.md#signature)
* [topic](ismartcontractevent.md#topic)
* [value](ismartcontractevent.md#optional-value)
* [values](ismartcontractevent.md#values)

## Properties

###  name

• **name**: *string*

Defined in did-resolver/src/models/resolver.ts:100

___

###  signature

• **signature**: *string*

Defined in did-resolver/src/models/resolver.ts:101

___

###  topic

• **topic**: *string*

Defined in did-resolver/src/models/resolver.ts:102

___

### `Optional` value

• **value**? : *string*

Defined in did-resolver/src/models/resolver.ts:112

___

###  values

• **values**: *object*

Defined in did-resolver/src/models/resolver.ts:103

#### Type declaration:

* **delegate**: *string*

* **delegateType**: *string*

* **identity**: *string*

* **name**? : *string*

* **previousChange**: *object*

* **validTo**: *BigNumber*

* **value**? : *string*
