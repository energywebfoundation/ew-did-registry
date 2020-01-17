[@ew-did-registry/did - v1.0.0](../README.md) › [Globals](../globals.md) › [PrivateClaim](privateclaim.md)

# Class: PrivateClaim

## Hierarchy

  ↳ [VerificationClaim](verificationclaim.md)

  ↳ **PrivateClaim**

## Implements

* [IClaim](../interfaces/iclaim.md)
* [IVerificationClaim](../interfaces/iverificationclaim.md)
* [IPrivateClaim](../interfaces/iprivateclaim.md)

## Index

### Constructors

* [constructor](privateclaim.md#constructor)

### Properties

* [claimData](privateclaim.md#claimdata)
* [didDocument](privateclaim.md#diddocument)
* [issuerDid](privateclaim.md#issuerdid)
* [jwt](privateclaim.md#jwt)
* [keyPair](privateclaim.md#keypair)
* [token](privateclaim.md#token)

### Methods

* [approve](privateclaim.md#approve)
* [createJWT](privateclaim.md#createjwt)
* [createPrivateClaimData](privateclaim.md#createprivateclaimdata)
* [decryptAndHashFields](privateclaim.md#decryptandhashfields)
* [getDid](privateclaim.md#getdid)
* [verify](privateclaim.md#verify)
* [verifyPayload](privateclaim.md#verifypayload)

## Constructors

###  constructor

\+ **new PrivateClaim**(`data`: [IPrivateClaimBuildData](../interfaces/iprivateclaimbuilddata.md)): *[PrivateClaim](privateclaim.md)*

*Overrides [Claim](claim.md).[constructor](claim.md#constructor)*

*Defined in [claims/src/private/index.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/private/index.ts#L11)*

Constructor takes as input Private Claim data.
eslint warning disabled to ensure type-checking.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | [IPrivateClaimBuildData](../interfaces/iprivateclaimbuilddata.md) |   |

**Returns:** *[PrivateClaim](privateclaim.md)*

## Properties

###  claimData

• **claimData**: *[IClaimData](../interfaces/iclaimdata.md)*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[claimData](../interfaces/iprivateclaim.md#claimdata)*

*Inherited from [Claim](claim.md).[claimData](claim.md#claimdata)*

*Defined in [claims/src/public/claim.ts:36](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/claim.ts#L36)*

claimData stores the claim fields

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [Claim](claim.md).[didDocument](claim.md#diddocument)*

*Defined in [claims/src/public/claim.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/claim.ts#L21)*

didDocument is used to store fetched DID Document

___

###  issuerDid

• **issuerDid**: *string*

*Defined in [claims/src/private/index.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/private/index.ts#L11)*

___

###  jwt

• **jwt**: *IJWT*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[jwt](../interfaces/iprivateclaim.md#jwt)*

*Inherited from [Claim](claim.md).[jwt](claim.md#jwt)*

*Defined in [claims/src/public/claim.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/claim.ts#L26)*

jwt stores the JWT to manage web tokens

___

###  keyPair

• **keyPair**: *IKeys*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[keyPair](../interfaces/iprivateclaim.md#keypair)*

*Inherited from [Claim](claim.md).[keyPair](claim.md#keypair)*

*Defined in [claims/src/public/claim.ts:41](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/claim.ts#L41)*

keyPair represents the implementation of key management interface

___

###  token

• **token**: *string*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md).[token](../interfaces/iprivateclaim.md#token)*

*Inherited from [Claim](claim.md).[token](claim.md#token)*

*Defined in [claims/src/public/claim.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/claim.ts#L31)*

claimToken stores the actual serialised JWT in a string format

## Methods

###  approve

▸ **approve**(): *Promise‹string›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [VerificationClaim](verificationclaim.md).[approve](verificationclaim.md#approve)*

*Defined in [claims/src/public/verificationClaim.ts:70](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/verificationClaim.ts#L70)*

Approve method signs the payload of the provided token with verifiers private key
Returns signed token on success

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { verificationClaim } from '@ew-did-registry/claims';

const keysVerifier = new Keys();
const jwtVerifier = new JWT(keysVerifier);
const tokenToVerify = publicClaim.token;
const dataVerifier = {
  jwt: jwtVerifier,
  keyPair: keysVerifier,
  token: tokenToVerify,
};

verificationClaim = new VerificationClaim(dataVerifier);
const approvedToken = await verificationClaim.approve();
console.log(approvedToken)
// If verification was successful, verifier can sign the payload of the token
// with his private key and return the approved JWT
```

**Returns:** *Promise‹string›*

___

###  createJWT

▸ **createJWT**(): *Promise‹void›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [Claim](claim.md).[createJWT](claim.md#createjwt)*

*Defined in [claims/src/public/claim.ts:147](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/claim.ts#L147)*

Method creates token with the payload provided in the claim data
The signed token is stored as a member of Claim class
This is a void method

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { Claim } from '@ew-did-registry/claims';

const keys = new Keys();
const jwt = new JWT(keys);
const claimData = {
  did: `did:ewc:0x${keys.publicKey}`,
  test: 'test',
};
const data = {
  jwt,
  keyPair: keys,
  claimData,
};
const publicClaim = new Claim(data);
await publicClaim.createJWT();
console.log(publicClaim.token);
```

**Returns:** *Promise‹void›*

___

###  createPrivateClaimData

▸ **createPrivateClaimData**(): *Promise‹[IClaimFields](../interfaces/iclaimfields.md)›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Defined in [claims/src/private/index.ts:52](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/private/index.ts#L52)*

Creation of Private Claim is a separate method to avoid asynchronous calls in the constructor

**`example`** 
```typescript
import { PrivateClaim } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
const keys = new Keys();
const jwt = new JWT(keys);
const claimData = {
 did: `did:ewc:0x${keys.publicKey}`,
 issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
 test: 'test',
};

const data = {
 jwt,
 keyPair: keys,
 claimData,
};
const privateClaim = new PrivateClaim(data);
await privateClaim.createPrivateClaimData();
console.log(privateClaim);
```

**Returns:** *Promise‹[IClaimFields](../interfaces/iclaimfields.md)›*

___

###  decryptAndHashFields

▸ **decryptAndHashFields**(): *void*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Defined in [claims/src/private/index.ts:129](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/private/index.ts#L129)*

This method is called when the issuer receives the token from the user with encrypted data

**`example`** 
```typescript
import { PrivateClaim } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
const keys = new Keys();
const issuerKeys = new Keys();
const jwt = new JWT(keys);
const claimData = {
did: `did:ewc:0x${keys.publicKey}`,
issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
 test: 'test',
};
const data = {
 jwt,
 keyPair: keys,
 claimData,
};
const privateClaim = new PrivateClaim(data);
await privateClaim.createPrivateClaimData();

const issuerJWT = new JWT(issuerKeys);
const issuerData = {
 jwt: issuerJWT,
 keyPair: issuerKeys,
 token: privateClaim.token,
}
const privateClaimIssuer = new PrivateClaim(issuerData);
privateClaimIssuer.decryptAndHashFields();
const hashedFields = privateClaimIssuer.claimData;
console.log(hashedFields);
```

**Returns:** *void*

void

___

###  getDid

▸ **getDid**(`did?`: string): *Promise‹boolean›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [Claim](claim.md).[getDid](claim.md#getdid)*

*Defined in [claims/src/public/claim.ts:103](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/claim.ts#L103)*

Method fetches the DID Document associated with did provided in claim data
DID Document is then stored as a member of Claim class. Returns true on success

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { Claim } from '@ew-did-registry/claims';

const keys = new Keys();
const jwt = new JWT(keys);
const claimData = {
  did: `did:ewc:0x${keys.publicKey}`,
  test: 'test',
};
const data = {
  jwt,
  keyPair: keys,
  claimData,
};
const publicClaim = new Claim(data);
await publicClaim.getDid();
console.log(publicClaim.didDocument);
```

**Parameters:**

Name | Type |
------ | ------ |
`did?` | string |

**Returns:** *Promise‹boolean›*

___

###  verify

▸ **verify**(): *Promise‹boolean›*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Inherited from [VerificationClaim](verificationclaim.md).[verify](verificationclaim.md#verify)*

*Defined in [claims/src/public/verificationClaim.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/public/verificationClaim.ts#L31)*

Verify method checks if the token was signed by the correct private key
Returns true on success

**`example`** 
```typescript
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { verificationClaim } from '@ew-did-registry/claims';

const keysVerifier = new Keys();
const jwtVerifier = new JWT(keysVerifier);
const tokenToVerify = publicClaim.token;
const dataVerifier = {
  jwt: jwtVerifier,
  keyPair: keysVerifier,
  token: tokenToVerify,
};

verificationClaim = new VerificationClaim(dataVerifier);
const verified = await verificationClaim.verify();
console.log(verified) // Should be true, if successful
```

**Returns:** *Promise‹boolean›*

___

###  verifyPayload

▸ **verifyPayload**(`saltedFields`: [IClaimFields](../interfaces/iclaimfields.md)): *boolean*

*Implementation of [IPrivateClaim](../interfaces/iprivateclaim.md)*

*Defined in [claims/src/private/index.ts:196](https://github.com/energywebfoundation/ew-did-registry/blob/57502c6/packages/claims/src/private/index.ts#L196)*

This method is called by the user after the issuer returns signed JWT with hashed
encrypted fields. Methods verifies if the payload was created correctly

**`example`** 
```typescript
import { PrivateClaim } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
const keys = new Keys();
const issuerKeys = new Keys();
const jwt = new JWT(keys);
const claimData = {
did: `did:ewc:0x${keys.publicKey}`,
issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
 test: 'test',
};
const data = {
 jwt,
 keyPair: keys,
 claimData,
};
const privateClaim = new PrivateClaim(data);
const saltedFields = await privateClaim.createPrivateClaimData();
privateClaim.decryptAndHashFields(issuerKeys.privateKey);
const issuerSignedToken = await issuerJWT.sign(privateClaim.claimData,
{ algorithm: 'ES256', noTimestamp: true });
const issuerClaimData = {
 did: `did:ewc:0x${issuerKeys.publicKey}`,
};
const issuerData = {
 jwt,
 keyPair: keys,
 token: issuerSignedToken,
 claimData: issuerClaimData,
}
const issuerReturnedPrivateClaim = new PrivateClaim(issuerData);
issuerReturnedPrivateClaim.verify();
const verified = issuerReturnedPrivateClaim.verifyPayload(saltedFields);
console.log(verified);
```

**Parameters:**

Name | Type |
------ | ------ |
`saltedFields` | [IClaimFields](../interfaces/iclaimfields.md) |

**Returns:** *boolean*

boolean
