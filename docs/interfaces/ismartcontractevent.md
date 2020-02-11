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

*Defined in [did-resolver/src/models/resolver.ts:95](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/did-resolver/src/models/resolver.ts#L95)*

___

###  signature

• **signature**: *string*

*Defined in [did-resolver/src/models/resolver.ts:96](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/did-resolver/src/models/resolver.ts#L96)*

___

###  topic

• **topic**: *string*

*Defined in [did-resolver/src/models/resolver.ts:97](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/did-resolver/src/models/resolver.ts#L97)*

___

### `Optional` value

• **value**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:107](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/did-resolver/src/models/resolver.ts#L107)*

___

###  values

• **values**: *object*

*Defined in [did-resolver/src/models/resolver.ts:98](https://github.com/energywebfoundation/ew-did-registry/blob/b17cc12/packages/did-resolver/src/models/resolver.ts#L98)*

#### Type declaration:

* **delegate**: *string*

* **delegateType**: *string*

* **identity**: *string*

* **name**? : *string*

* **previousChange**: *object*

* **validTo**: *BigNumber*

* **value**? : *string*
