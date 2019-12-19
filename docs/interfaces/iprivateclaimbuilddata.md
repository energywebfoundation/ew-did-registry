[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IPrivateClaimBuildData](iprivateclaimbuilddata.md)

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
* [token](iprivateclaimbuilddata.md#optional-token)

## Properties

### `Optional` claimData

• **claimData**? : *[IClaimData](iclaimdata.md)*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[claimData](iclaimbuilddata.md#optional-claimdata)*

*Defined in [claims/src/models/index.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/a4f69d5/packages/claims/src/models/index.ts#L30)*

___

### `Optional` issuerDid

• **issuerDid**? : *string*

*Defined in [claims/src/models/index.ts:90](https://github.com/energywebfoundation/ew-did-registry/blob/a4f69d5/packages/claims/src/models/index.ts#L90)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[jwt](iclaimbuilddata.md#jwt)*

*Defined in [claims/src/models/index.ts:27](https://github.com/energywebfoundation/ew-did-registry/blob/a4f69d5/packages/claims/src/models/index.ts#L27)*

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[keyPair](iclaimbuilddata.md#keypair)*

*Defined in [claims/src/models/index.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/a4f69d5/packages/claims/src/models/index.ts#L28)*

___

### `Optional` token

• **token**? : *string*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[token](iclaimbuilddata.md#optional-token)*

*Defined in [claims/src/models/index.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/a4f69d5/packages/claims/src/models/index.ts#L29)*
