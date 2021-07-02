## DID-Registry Package
DID Registry package wraps the different functionality around the DID and serves as a single point of entry to manage DID and claims lifecycle.

* **Instantiate DID Registry**
```typescript
const userKeys = new Keys({
    privateKey: '813e864ffa199f3cd38d8dcf2b097a2e2b226e000f3a05267eee23d0da7086f4',
    publicKey: '029462cf4b9ece1f84b600e3d924641aa359f068f1876cbf08b1b345e4c9831f23',
  });
  
const userDid = 'did:ethr:0x7551eD4be4eFd75E602189E9d59af448A564AB3a';

//initialise the DIDRegistry with keys and a configured Resolver instance
const didReg = new DIDRegistry(userKeys, userDid, provider, resolverSettings), new DidStore(ipfsUrl), providerSettings);

// create a claimsCreator for User
const userClaims = didReg.claims.createClaimsUser();

//construct the claim payload for public claim
const claimData = {
      name: 'Tesla Model 3',
      capacity: '10',
      price: '500',
    }; 

// create a signed claim token with claim payload/data
const claimToken = await userClaims.createPublicClaim(claimData);
```