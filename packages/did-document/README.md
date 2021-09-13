## DID-DOCUMENT Package
The did-document package functionality is in line with did-reg package. The Interfaces provides the client with a factory to create DID Document objects, which in turn expose DID CRUD operations in the full version, as well as read operations for lite version. Interfaces are created by conforming to [W3C DIDs v1.0](https://w3c.github.io/did-core/) standard.
The goal of the [Resolver](https://github.com/energywebfoundation/ew-did-registry/blob/development/packages/did-resolver-interface/src/interface.ts) interface is to provide flexibility to the user to define his own implementation of the Resolver for the required DID method on Energy Web chain. Currently the 1056 [Operator](https://github.com/energywebfoundation/ew-did-registry/blob/development/packages/did-ethr-resolver/src/implementations/operator.ts) implements the CRUD behaviour required for `ethr` DID method which is based on ERC1056 standard.
### Create
To create a DID,
```typescript
const ownerAddress = '0xed6011BBaB3B98cF955ff271F52B12B94BF9fD28';
const did = `did:ethr:${ownerAddress}`;

const providerSettings = {
  type: ProviderTypes.HTTP,
  uriOrInfo: 'https://volta-rpc.energyweb.org',
}

const keys = new Keys({
  privateKey: '0b4e103fe261142b716fc5c055edf1e70d4665080395dbe5992af03235f9e511',
  publicKey: '02963497c702612b675707c0757e82b93df912261cd06f6a51e6c5419ac1aa9bcc',
});
const signer = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);

///instantiate the operator with configured Resolver Settings
const operator = new Operator(signer, resolverSettings);

//create the DIDDocumentFull instance
const document = new DIDDocumentFull(did, operator);

// For the 1056 implementation this will only add public key the user's DID Document. There is no blockchain transaction involved
const created = await document.create();
```
### Read
Using the EW DID resolver we can read the whole DID document. You can read specific attribute using the DIDDocument instance.
#### Fetching the whole DID Document 
```typescript
import { Resolver } from '@fl-did-registry/did-ethr-resolver';

// did of the user
const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';

// Read the whole document 
const document: IDidDocument = Resolver.read(did);

// Check whether it's a valid DID document 
```
#### Reading an attribute
```typescript

const didDocumentLite: IDIDDocumentLite;

// initialise the DIDDocument instance with configured resolver
didDocumentLite = new DIDDocumentLite(did, resolver);

//read the public key of the user from DID document
const publicKey = await didDocumentLite.read(Attributes.publicKey, 'Secp256k1VerificationKey');

```

### Update
#### Adding a valid public key for verfication.
```typescript
// add an attribute to DID Document of the user
const updated = await document.update(
  DIDAttribute.PublicKey,
  {
    type: PubKeyType.VerificationKey2018,
    algo: Algorithms.ED25519,
    encoding: Encoding.HEX,
    value: new Keys().publicKey,
  },
  validity,
);
```
#### Adding an authentication method
```typescript=
const delegate = new Wallet(new Keys().privateKey);

const updated = await document.update(
  DIDAttribute.Authenticate,
  {
    type: PubKeyType.SignatureAuthentication2018,
    algo: Algorithms.ED25519,
    encoding: Encoding.HEX,
    delegate: delegate.address,
  },
  validity,
);
```
#### Adding a service endpoint for a claim
```typescript
// serviceEndPoint of the claim to be added
const endpoint = 'https://claimstore.energyweb.org/gba42asdf';

//add the service endpoint
const updated = await document.update(
  DIDAttribute.ServicePoint,
  {
    type: PubKeyType.VerificationKey2018,
    value: endpoint,
  },
  validity,
);
```
### Delete/Revoke
> Currently revocation functionality exposed only through IOperator interface. In future, it will available through the IDIDDocument interface
#### Revocation of the public key
```typescript
//publicKey to be revoked
const attribute = DIDAttribute.PublicKey;

const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: keysAttribute.publicKey,
    };
const revoked = await operator.revokeAttribute(did, attribute, updateData);
```
#### Revocation of the authentication method
```typescript
//authentication method to be Revoked
const delegateDid = `did:ewc:${delegate.address}`;

//revoke the authentication method
const revoked = await operator.revokeDelegate(did, PubKeyType.VerificationKey2018, delegateDid);
```
#### Revocation of the service point
```typescript
//serviceEndpoint to be revoked
const endpoint = 'https://claimstore.energyweb.org/gba42asdf';

const revoked = await operator.revokeAttribute(
    did, 
    DIDAttribute.ServicePoint,
   {
    type: PubKeyType.VerificationKey2018,
    value: endpoint,
  }
);
```
#### Revoking all attributes
```typescript
// revokes attributes related to authentication and service endpoints
const deactivated = await document.deactivate();
```
