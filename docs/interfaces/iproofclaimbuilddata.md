[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IProofClaimBuildData](iproofclaimbuilddata.md)

# Interface: IProofClaimBuildData

Proof Claim Build Data extends the general Claim Build Data
interface and is required to construct Proof Claims

## Hierarchy

* [IClaimBuildData](iclaimbuilddata.md)

  ↳ **IProofClaimBuildData**

## Index

### Properties

* [claimData](iproofclaimbuilddata.md#optional-claimdata)
* [hashedFields](iproofclaimbuilddata.md#optional-hashedfields)
* [jwt](iproofclaimbuilddata.md#jwt)
* [keyPair](iproofclaimbuilddata.md#keypair)
* [resolverSettings](iproofclaimbuilddata.md#optional-resolversettings)
* [token](iproofclaimbuilddata.md#optional-token)

## Properties

### `Optional` claimData

• **claimData**? : *[IClaimData](iclaimdata.md)*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[claimData](iclaimbuilddata.md#optional-claimdata)*

*Defined in [claims/src/models/index.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/d2ee593/packages/claims/src/models/index.ts#L31)*

___

### `Optional` hashedFields

• **hashedFields**? : *number[]*

*Defined in [claims/src/models/index.ts:107](https://github.com/energywebfoundation/ew-did-registry/blob/d2ee593/packages/claims/src/models/index.ts#L107)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[jwt](iclaimbuilddata.md#jwt)*

*Defined in [claims/src/models/index.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/d2ee593/packages/claims/src/models/index.ts#L28)*

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[keyPair](iclaimbuilddata.md#keypair)*

*Defined in [claims/src/models/index.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/d2ee593/packages/claims/src/models/index.ts#L29)*

___

### `Optional` resolverSettings

• **resolverSettings**? : *IResolverSettings*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[resolverSettings](iclaimbuilddata.md#optional-resolversettings)*

*Defined in [claims/src/models/index.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/d2ee593/packages/claims/src/models/index.ts#L32)*

___

### `Optional` token

• **token**? : *string*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[token](iclaimbuilddata.md#optional-token)*

*Defined in [claims/src/models/index.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/d2ee593/packages/claims/src/models/index.ts#L30)*
