[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IHandlers](ihandlers.md)

# Interface: IHandlers

This interface simply specifies the handler functions for different event types
in order to parse the data from the events in the blockchain.

## Hierarchy

* **IHandlers**

## Indexable

* \[ **key**: *string*\]: function

This interface simply specifies the handler functions for different event types
in order to parse the data from the events in the blockchain.

▸ (`event`: [ISmartContractEvent](ismartcontractevent.md), `etherAddress`: string, `document`: [IDIDLogData](ididlogdata.md), `validTo`: BigNumber, `block`: number): *[IDIDLogData](ididlogdata.md)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [ISmartContractEvent](ismartcontractevent.md) |
`etherAddress` | string |
`document` | [IDIDLogData](ididlogdata.md) |
`validTo` | BigNumber |
`block` | number |
