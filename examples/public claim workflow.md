# Private claim workflow

* **Importing required modules**

``` typescript
import { expect } from 'chai';
import {
  Resolver, Operator, DIDAttribute, IUpdateData, PubKeyType, Algorithms, Encoding,
} from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
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
  const userDid = `did:${Methods.Erc1056}:${userAddress}` ;
```  
`` `Operator` `` - is an interface responsible for DID document updating
```typescript 
  const userOperator = new Operator(userKeys);
```
Before using DID document it needs to be initialized. During initialization, 
the document stores the user's public key associated with its etherum address 
``` typescript
  await userOperator.create();
```
```DIDRegistry``` - main interface for working with claims and DID documents
``` typescript
  const user = new DIDRegistry(userKeys, userDid, new Resolver(resolverSettings));
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
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  }); 
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B'; 
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}` ; 
  const issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver(resolverSettings)); 
  const issuerClaims = issuer.claims.createClaimsIssuer();
```
Same flow for verifier
```typescript 
  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  }); 
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd'; 
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}` ; 
  const verifier = new DIDRegistry(verifierKeys, verifierDid, new Resolver(resolverSettings)); 
```
The time interval during which the corresponding record in the DID document will
be valid
```typescript 
  const validity = 5 * 60 * 1000;
```
* **Claim creation**
```typescript 
  const claimData = {
      name: 'Tesla Model 3',
      capacity: '10',
      price: '500',
    }; 
    const token = await userClaims.createPublicClaim(claimData);
```
* **Claim issuance**
```typescript 
  const issuedToken = await issuerClaims.issuePublicClaim(token);
```
* **Verification of issued claim and adding issuer to delegates**

'verifyPublicClaim' check if the claim has the correct payload and
also adds delegate to the smart contract
```typescript 
  const verified = await userClaims.verifyPublicClaim(issuedToken); 
  expect(verified).is.true;
  };
```

* **Verifier checks if the presented token is valid**

'verifyPublicProof' checks the signature on the claim, as well as 
whether the delegate is valid for the DID
```typescript 
  const verified = await claimsUser.verifyPublicProof(issuedToken);
  expect(verified).to.be.true;
```

An ```IDIDDocumetLite``` interface is used to read a document
```typescript 
  const userLigthDoc: IDIDDocument = user.documentFactory.createLite(new Resolver(resolverSettings)); 
  await userLigthDoc.read(userDid); 
  let document = userLigthDoc.didDocument;
```

An ```IDIDDocumetFull``` interface is used to update a document
```typscript
  const userFullDoc: IDIDDocumentFull = user.documentFactory.createFull(new Operator(userKeys)); 
  expect(userFullDoc).instanceOf(DIDDocumentFull);
  await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity); 
});
```