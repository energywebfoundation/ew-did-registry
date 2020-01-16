[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IPrivateClaimBuildData](iprivateclaimbuilddata.md)

# Interface: IPrivateClaimBuildData

Private Claim Build Data extends the general Claim Build Data
interface and is required to construct Private Claims

## Hierarchy

* [IClaimBuildData](iclaimbuilddata.md)

  ↳ **IPrivateClaimBuildData**

## Index

### Properties

* [claimData](iprivateclaimbuilddata.md#optional-claimdata)
* [issuerDid](iprivateclaimbuilddata.md#optional-issuerdid)
* [jwt](iprivateclaimbuilddata.md#jwt)
* [keyPair](iprivateclaimbuilddata.md#keypair)
* [resolver](iprivateclaimbuilddata.md#resolver)
* [signerDid](iprivateclaimbuilddata.md#optional-signerdid)
* [token](iprivateclaimbuilddata.md#optional-token)

## Properties

### `Optional` claimData

• **claimData**? : *[IClaimData](iclaimdata.md)*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[claimData](iclaimbuilddata.md#optional-claimdata)*

*Defined in [claims/src/models/index.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L32)*

___

### `Optional` issuerDid

• **issuerDid**? : *string*

*Defined in [claims/src/models/index.ts:103](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L103)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[jwt](iclaimbuilddata.md#jwt)*

*Defined in [claims/src/models/index.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L28)*

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[keyPair](iclaimbuilddata.md#keypair)*

*Defined in [claims/src/models/index.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L29)*

___

###  resolver

• **resolver**: *Resolver*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[resolver](iclaimbuilddata.md#resolver)*

*Defined in [claims/src/models/index.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L30)*

___

### `Optional` signerDid

• **signerDid**? : *string*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[signerDid](iclaimbuilddata.md#optional-signerdid)*

*Defined in [claims/src/models/index.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L33)*

___

### `Optional` token

• **token**? : *string*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[token](iclaimbuilddata.md#optional-token)*

*Defined in [claims/src/models/index.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/claims/src/models/index.ts#L31)*
