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

*Defined in [did-resolver/src/models/resolver.ts:97](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/models/resolver.ts#L97)*

___

###  signature

• **signature**: *string*

*Defined in [did-resolver/src/models/resolver.ts:98](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/models/resolver.ts#L98)*

___

###  topic

• **topic**: *string*

*Defined in [did-resolver/src/models/resolver.ts:99](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/models/resolver.ts#L99)*

___

### `Optional` value

• **value**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:109](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/models/resolver.ts#L109)*

___

###  values

• **values**: *object*

*Defined in [did-resolver/src/models/resolver.ts:100](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/models/resolver.ts#L100)*

#### Type declaration:

* **delegate**: *string*

* **delegateType**: *string*

* **identity**: *string*

* **name**? : *string*

* **previousChange**: *object*

* **validTo**: *BigNumber*

* **value**? : *string*
