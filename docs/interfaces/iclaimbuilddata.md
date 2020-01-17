[@ew-did-registry/did - v1.0.0](../README.md) › [Globals](../globals.md) › [IClaimBuildData](iclaimbuilddata.md)

# Interface: IClaimBuildData

Claim Build Data outlines the necessary properties used to create
each of the Claim types

## Hierarchy

* **IClaimBuildData**

  ↳ [IPrivateClaimBuildData](iprivateclaimbuilddata.md)

  ↳ [IProofClaimBuildData](iproofclaimbuilddata.md)

## Index

### Properties

* [claimData](iclaimbuilddata.md#optional-claimdata)
* [jwt](iclaimbuilddata.md#jwt)
* [keyPair](iclaimbuilddata.md#keypair)
* [resolver](iclaimbuilddata.md#resolver)
* [signerDid](iclaimbuilddata.md#optional-signerdid)
* [token](iclaimbuilddata.md#optional-token)

## Properties

### `Optional` claimData

• **claimData**? : *[IClaimData](iclaimdata.md)*

*Defined in [claims/src/models/index.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L32)*

___

###  jwt

• **jwt**: *IJWT*

*Defined in [claims/src/models/index.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L28)*

___

###  keyPair

• **keyPair**: *IKeys*

*Defined in [claims/src/models/index.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L29)*

___

###  resolver

• **resolver**: *Resolver*

*Defined in [claims/src/models/index.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L30)*

___

### `Optional` signerDid

• **signerDid**? : *string*

*Defined in [claims/src/models/index.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L33)*

___

### `Optional` token

• **token**? : *string*

*Defined in [claims/src/models/index.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/models/index.ts#L31)*
