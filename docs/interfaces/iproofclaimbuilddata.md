[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IProofClaimBuildData](iproofclaimbuilddata.md)

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
* [token](iproofclaimbuilddata.md#optional-token)

## Properties

### `Optional` claimData

• **claimData**? : *[IClaimData](iclaimdata.md)*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[claimData](iclaimbuilddata.md#optional-claimdata)*

*Defined in [claims/src/models/index.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/dae0af4/packages/claims/src/models/index.ts#L30)*

___

### `Optional` hashedFields

• **hashedFields**? : *number[]*

*Defined in [claims/src/models/index.ts:98](https://github.com/energywebfoundation/ew-did-registry/blob/dae0af4/packages/claims/src/models/index.ts#L98)*

___

###  jwt

• **jwt**: *IJWT*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[jwt](iclaimbuilddata.md#jwt)*

*Defined in [claims/src/models/index.ts:27](https://github.com/energywebfoundation/ew-did-registry/blob/dae0af4/packages/claims/src/models/index.ts#L27)*

___

###  keyPair

• **keyPair**: *IKeys*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[keyPair](iclaimbuilddata.md#keypair)*

*Defined in [claims/src/models/index.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/dae0af4/packages/claims/src/models/index.ts#L28)*

___

### `Optional` token

• **token**? : *string*

*Inherited from [IClaimBuildData](iclaimbuilddata.md).[token](iclaimbuilddata.md#optional-token)*

*Defined in [claims/src/models/index.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/dae0af4/packages/claims/src/models/index.ts#L29)*
