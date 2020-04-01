# @ew-did-registry/did-store

The package provides decentralized claims storage functionality

## How to use

To use the storage, you need to know the identifier of the hub or its endpoint
 (at the moment, the endpoint is a required parameter)
 
 1. Register new identity:
 
``` javascript
 const did = await DidStore.register();
```

 2. Create store
 ```javascript
 import { Keys } from '@ew-did-registry/keys'; 
 
 const privateKey = new Keys().privateKey; 
 const hubDid = 'did:test:123-abc'; 
 const hubEndpoint = 'http://localhost:8080'; 
 const store = new Store(did, privateKey, hubDid, hubEndpoint); 
 ```
 
 2. Store the claim
 ```javascript
 const claim = 'Stringified claim';
 const claimId = await store.store(claim);
 ```
 3. Fetch claim by its id
 ```javascript
 const fetchedClaim = await store.fetchClaim(claimId);
 ```
 
 ## How to test
 
 To test you need to run `@ew-did-registry/did-hub` on `localhost:8080`.
 Then 
 ```bash
 npm test
 ```

