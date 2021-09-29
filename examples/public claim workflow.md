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
`Operator` - Interface used to access the document. User can provide his
own implementation of the interface depending on the DID method. The library 
provides reference implementation based on ERC-1056

```typescript
  const userKeys = new Keys();
  const signer = EwSigner.fromPrivateKey(userKeys.privateKey, providerSettings);
  const userOperator = new Operator(user, registrySettings);
```

` DIDRegistry ` - main class for working with claims and DID documents

``` typescript
  const user = new DIDRegistry(userKeys, userDid, userOperator, didStore);
```

Before using DID document it needs to be initialized. During initialization, 
the document stores the user's verification public key 

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
  const issuer = EwSigner.fromPrivateKey(issuerKeys.privateKey, providerSettings);
  const issuerOperator = new Operator(issuer, resolverSettings); 
  const issuerReg = new DIDRegistry(issuerKeys, issuerDid, issuerOperator, didStore, providerSettings); 
  const issuerClaims = issuerReg.claims.createClaimsIssuer(); 
``` 
Same flow for verifier

```typescript 
  const verifierKeys = new Keys(); 
  const verifierAddress = verifierKeys.getAddress(); 
  const verifierDid = `did:${Methods.EnergyWeb}:${verifierAddress}`;
  const verifier = EwSigner.fromPrivateKey(verifierKeys.privateKey, providerSettings);
  const verifierOperator = new Operator(verifier, resolverSettings); 
  const verifierReg = new DIDRegistry(verifierKeys, verifierDid, verifierOperator, didStore, providerSettings); 
  const verifierClaims = verifierReg.claims.createClaimsVerifier();

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

* **Publishing of issued claim**

Verifies issuer's signature, payload of the issued claim, adds issuer to 
delegates and saves claim.  Optionally hashing algorithm can be provided. 
By default SHA256 is used

```typescript 
  const claimUrl = await userClaims.publishPublicClaim(issuedToken, publicData); 
``` 

* **Verification of the presented claim**

Retrieve issued claim, check if the issuer is user's delegate and verify claim
integrity. Optionally a map of hashing algorithms can be provided. By default 
SHA256 is used

```typescript 
  const verified = await claimsVerifier.verifyPublicProof(claimUrl);
```