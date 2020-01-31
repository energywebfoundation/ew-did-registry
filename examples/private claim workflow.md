# Private claim workflow

* **Importing required modules**

``` typescript
  import { expect } from 'chai';
  import {
    Resolver, Operator, DIDAttribute, IUpdateData, PubKeyType, Algorithms, Encoding,
  } from '@ew-did-registry/did-resolver';
  import { Keys } from '@ew-did-registry/keys';
  import { Networks } from '@ew-did-registry/did';
  import { IClaim } from '@ew-did-registry/claims';
  import { DIDDocumentFull } from '@ew-did-registry/did-document';
  import DIDRegistry from '@ew-did-registry/did-registry';
```
* **Creating identities based on their roles**

User is the claims subject
``` typescript
  const userKeys = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const userDid = `did:${Networks.Ethereum}:${userAddress}` ;
```
```Operator``` - an interface responsible for DID document updating
``` typescript
  const userOperator = new Operator(userKeys);
```
Before using DID document it needs to be initialized. During initialization, 
the document stores the user's public key associated with its Etherum address. 
Each document update costs a Volts, therefore make sure that there are enough 
funds on the account
``` typescript
  await userOperator.create();
```
```DIDRegistry``` - main interface for working with claims and DID documents
``` typescript
  const user = new DIDRegistry(userKeys, userDid, new Resolver());
```
Claims creator is represented by ```IClaimsUser```
```typescript 
  const userClaims: IClaimsUser = user.claims.createClaimsUser();
```  
Same flow for issuer. Issuer checks claim data and issue token, which can be 
stored and verified
```typescript 
  const issuerKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263,
  }); 
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B'; 
  const issuerDid = `did:${Networks.Ethereum}:${issuerAddress}` ; 
  const issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver()); 
  const issuerClaims = issuer.claims.createClaimsIssuer();
```
Same flow for verifier
```typescript 
  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  }); 
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd'; 
  const verifierDid = `did:${Networks.EnergyWeb}:${verifierAddress}` ; 
  const verifier = new DIDRegistry(verifierKeys, verifierDid, new Resolver());
```
The time interval during which the corresponding record in the DID document will
be valid. Validity is stored in milliseconds, hence 5 minutes are represented in 
the example below
```typescript 
  const validity = 5 * 60 * 1000;
```
* **Claim creation**
```typescript 
  const claimData = {
    secret: '123',
    notSecret: 'string',
  };
  const { token, saltedFields } = await userClaims.createPrivateClaim(claimData, issuerDid);
```
Private claim will contain private user data encoded with issuer key. Salted 
fields will be used to verify issued claim and to create proof claim

* **Claim issuance**

Issuer encodes private user data and then hashes it
```typescript 
  const issuedToken = await issuerClaims.issuePrivateClaim(token);
```

* **Verification of issued claim and adding issuer to delegates**

```typescript 
  const verified = await userClaims.verifyPrivateClaim(issuedToken, saltedFields); 
  expect(verified).is.true;
  const claim: IClaim = userClaims.jwt.decode(issuedToken) as IClaim; 
  expect(claim.did).equal(userDid); 
  expect(claim.signer).equal(issuerDid); 
  expect(claim.claimData).deep.equal(claimData); 
  const updateData: IUpdateData = {
    algo: Algorithms.Secp256k1,
    type: PubKeyType.VerificationKey2018,
    encoding: Encoding.HEX,
    delegate: issuerAddress,
  };
```

An ```IDIDDocumetLite``` interface is used to read a document
```typescript 
  const userLigthDoc: IDIDDocument = user.documentFactory.createLite(new Resolver()); 
  await userLigthDoc.read(userDid); 
  let document = userLigthDoc.didDocument;
```
An ```IDIDDocumetFull``` interface is used to update a document
```typescript 
  const userFullDoc: IDIDDocumentFull = user.documentFactory.createFull(new Operator(userKeys)); 
  expect(userFullDoc).instanceOf(DIDDocumentFull);
  await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity); 
  await userLigthDoc.read(userDid);
  document = userLigthDoc.didDocument;
  const expectedPkId = `${userDid}#delegate-${PubKeyType.VerificationKey2018}-${issuerAddress}`;
  expect(document.publicKey.find((pk) => pk.id === expectedPkId)).to.not.undefined;
```
Application saves issued token

* **User proves his ownership of private data**

```typescript 
  const claimUrl = 'http://test.service.com';
  const encryptedSaltedFields: IProofData = {};
  let counter = 0;
  Object.entries(saltedFields).forEach(([key, value]) => {
    if (counter % 2 === 0) {
      encryptedSaltedFields[key] = {
        value,
        encrypted: true,
      };
    } else {
      encryptedSaltedFields[key] = {
        value,
        encrypted: false,
      };
    }
    // eslint-disable-next-line no-plusplus
    counter++;
  });
  const proofToken = await userClaims.createProofClaim(claimUrl, encryptedSaltedFields);
```
Application loads issued token from claimUrl = 'http://claim.url' and 
cryptographycally matches it with proof token
```typescript 
  verified = await verifier.claims.createClaimsVerifier().verifyPrivateProof(proofToken, issuedToken);
  expect(verified).is.true;
```
