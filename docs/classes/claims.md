[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Claims](claims.md)

# Class: Claims

## Hierarchy

* **Claims**

## Implements

* [IClaims](../interfaces/iclaims.md)

## Index

### Constructors

* [constructor](claims.md#constructor)

### Methods

* [createPrivateClaim](claims.md#createprivateclaim)
* [createProofClaim](claims.md#createproofclaim)
* [createPublicClaim](claims.md#createpublicclaim)
* [generateClaimFromToken](claims.md#generateclaimfromtoken)

## Constructors

###  constructor

\+ **new Claims**(`keyPair`: IKeys): *[Claims](claims.md)*

Defined in claims/src/claims/claims.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`keyPair` | IKeys |

**Returns:** *[Claims](claims.md)*

## Methods

###  createPrivateClaim

▸ **createPrivateClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md), `didIssuer`: string): *Promise‹[IPrivateClaim](../interfaces/iprivateclaim.md)›*

*Implementation of [IClaims](../interfaces/iclaims.md)*

Defined in claims/src/claims/claims.ts:80

Creates claim which will be sent in encoded form to the didIssuer

**`example`** 
```typescript
import { Claims } from '@ew-did-registry/claims';
import { Networks } from '@ew-did-registry/did';

const claims = new Claims(keys);
const claimData = {
    did: 'did:Networks.Ethereum:my_id',
    data: 'secret data'
};
const didIssuer = 'did:Networks.Ethereum:issuer_id';
const claim = await claims.createPrivateClaim(claimData, didIssuer);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) | - |
`didIssuer` | string |   |

**Returns:** *Promise‹[IPrivateClaim](../interfaces/iprivateclaim.md)›*

___

###  createProofClaim

▸ **createProofClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md), `hashedFields`: object): *Promise‹[IProofClaim](../interfaces/iproofclaim.md)›*

Defined in claims/src/claims/claims.ts:113

Creates claim with verifiable data in hashedFields

**`example`** 
```typescript
import { Claims } from '@ew-did-registry/claims';
import { Networks } from '@ew-did-registry/did';

const claims = new Claims(keys);
const claimData = {
    did: 'did:Networks.Ethereum:my_id',
    data: 'secret data'
};
const hashedFields = [123, 456];
const claim = await claims.createProofClaim(claimData, hashedFields);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) | - |
`hashedFields` | object |   |

**Returns:** *Promise‹[IProofClaim](../interfaces/iproofclaim.md)›*

___

###  createPublicClaim

▸ **createPublicClaim**(`claimData`: [IClaimData](../interfaces/iclaimdata.md)): *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md)›*

*Implementation of [IClaims](../interfaces/iclaims.md)*

Defined in claims/src/claims/claims.ts:49

Creates verifiable claim with data about subject provided in claimData

**`example`** 
```typescript
import { Claims } from '@ew-did-registry/claims';
import { Networks } from '@ew-did-registry/did';

const claims = new Claims(keys);
const claimData = {
    did: 'did:Networks.Ethereum:my_id',
    data: 'data'
};
const claim = await claims.createPublicClaim(claimData);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`claimData` | [IClaimData](../interfaces/iclaimdata.md) |   |

**Returns:** *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md)›*

___

###  generateClaimFromToken

▸ **generateClaimFromToken**(`token`: string, `type`: [ClaimType](../enums/claimtype.md)): *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md) | [IPrivateClaim](../interfaces/iprivateclaim.md) | [IProofClaim](../interfaces/iproofclaim.md)›*

*Implementation of [IClaims](../interfaces/iclaims.md)*

Defined in claims/src/claims/claims.ts:141

Creates claim of the specified type from the serialized claim

**`example`** 
```typescript
import { Claims, ClaimType } from '@ew-did-registry/claims';

const keys = new Keys();
const claims = new Claims(keys);
const claim = claims.generateClaimFromToken(
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token` | string | - |
`type` | [ClaimType](../enums/claimtype.md) |   |

**Returns:** *Promise‹[IVerificationClaim](../interfaces/iverificationclaim.md) | [IPrivateClaim](../interfaces/iprivateclaim.md) | [IProofClaim](../interfaces/iproofclaim.md)›*

Promise<IVerificationClaim | IPrivateClaim | IProofClaim>
