[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [ISmartContractEvent](ismartcontractevent.md)

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

*Defined in [did-resolver/src/models/resolver.ts:100](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-resolver/src/models/resolver.ts#L100)*

___

###  signature

• **signature**: *string*

*Defined in [did-resolver/src/models/resolver.ts:101](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-resolver/src/models/resolver.ts#L101)*

___

###  topic

• **topic**: *string*

*Defined in [did-resolver/src/models/resolver.ts:102](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-resolver/src/models/resolver.ts#L102)*

___

### `Optional` value

• **value**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:112](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-resolver/src/models/resolver.ts#L112)*

___

###  values

• **values**: *object*

*Defined in [did-resolver/src/models/resolver.ts:103](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-resolver/src/models/resolver.ts#L103)*

#### Type declaration:

* **delegate**: *string*

* **delegateType**: *string*

* **identity**: *string*

* **name**? : *string*

* **previousChange**: *object*

* **validTo**: *BigNumber*

* **value**? : *string*
