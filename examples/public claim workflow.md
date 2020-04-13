# Public claim workflow

* **Importing required modules**

``` typescript
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import DIDRegistry from '@ew-did-registry/did-registry';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
```

* **Creating store** 

``` typescript
  const store = new DidStore(ipfsApi);
```

* **Creating identities based on their roles**

*User* is the claims subject

``` typescript
  const userKeys = new Keys();
  const userAddress = userKeys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}` ;
```  
`Operator` - is an interface responsible for DID document updating

```typescript 
  const userOperator = new Operator(userKeys, resolverSettings);
```

` DIDRegistry ` - main interface for working with claims and DID documents

``` typescript
  const user = new DIDRegistry(userKeys, userDid, userOperator, store);
```

Before using DID document it needs to be initialized. During initialization, 
the document stores the user's public key 

``` typescript
  await user.document.create();
```

Claims creator is represented by ` IClaimsUser ` 

``` typescript
  const userClaims = user.claims.createClaimsUser();
```

Same flow for issuer. Issuer checks claim data and issue token, which can be 
stored and verified

```typescript 
  const issuerKeys = new Keys(); 
  const issuerAddress = issuerKeys.getAddress(); 
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}` ; 
  const issuerOperator = new Operator(issuerKeys, resolverSettings); 
  const issuer = new DIDRegistry(issuerKeys, issuerDid, issuerOperator, store); 
  const issuerClaims = issuer.claims.createClaimsIssuer(); 

``` 

Same flow for verifier

```typescript 
  const verifierKeys = new Keys(); 
  const verifierAddress = verifierKeys.getAddress(); 
  const verifierDid = `did:${Methods.EnergyWeb}:${verifierAddress}` ; 
  const verifierOperator = new Operator(verifierKeys, resolverSettings); 
  const verifier = new DIDRegistry(verifierKeys, verifierDid, verifierOperator, store); 
  const verifierClaims = verifier.claims.createClaimsVerifier();

``` 

* **Claim creation**

```typescript 
  const claimData = {
    name: 'Lisence', 
    sn: 'abc123',
  }; 
const token = await userClaims.createPublicClaim(publicData); 

``` 

* **Claim issuance**

```typescript 
  const issuedToken = await issuerClaims.issuePublicClaim(token);
```

* **Verification of issued claim**

Verifies issuer's signature, payload of the issued claim, adds issuer to delegates and saves claim

```typescript 
  const claimUrl = await userClaims.publishPublicClaim(issuedToken, publicData); 
``` 

* **Verification of the presented claim**

Retrieve issued claim, check if the issuer is user's delegate and verify claim integrity

```typescript 
  const verified = await claimsVerifier.verifyPublicProof(claimUrl);
```
