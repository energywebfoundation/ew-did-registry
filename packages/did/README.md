## DID Package
The DID Package provides a clean interface which allows the client to store and use different DIDs depending on the network. The `did` will be aware of the different network and method syntax.
> We are working on making the `did` package more useful.
```typescript
// Instantiate the DID holder
const DID = new IDID();

// Setting the DID; network is inferred from the DID
DID.set(energyDid);

// Setting the DID by explicitly providing the network
DID.set(Networks.EnergyWeb, energyAddress);

// Retrieving current DID for the specified network.
// Returns either the respective DID or undefined
const id = DID.get(Networks.EnergyWeb);
```