```typescript
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Wallet } from 'ethers';
const { Keys } = require('ew-did-registry/packages/keys');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Networks } = require('ew-did-registry/packages/did');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DIDRegistry = require('ew-did-registry/packages/did-registry').default;
const {
  Resolver,
  Operator,
  DIDAttribute,
  PubKeyType,
  Algorithms,
  Encoding,
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('ew-did-registry/packages/did-resolver');
const exampleTest = async () => {
  const assetKeys = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const assetAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const assetDid = `did:${Networks.EnergyWeb}:${assetAddress}`;
  const issuerKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B';
  const issuerDid = `did:${Networks.EnergyWeb}:${issuerAddress}`;
  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  });
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd';
  const verifierDid = `did:${Networks.EnergyWeb}:${verifierAddress}`;
  const claimData = {
    name: 'Tesla Model 3',
    capacity: '10',
    price: '500',
  };
  const asset = new DIDRegistry(assetKeys, assetDid, new Resolver());
  const assetClaims = asset.claims.createClaimsUser();
  const token = await assetClaims.createPublicClaim(claimData);
  // send token to Issuer
  const issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver());
  const issuerClaims = issuer.claims.createClaimsIssuer();
  const issuedToken = await issuerClaims.issuePublicClaim(token);
  // send to Verifier/Owner
  const verified = await assetClaims.verifyPublicClaim(issuedToken);
  const claim = assetClaims.jwt.decode(issuedToken);
  // Issued token valid, issuer can be added to delegates
  const updateData = {
    algo: Algorithms.Secp256k1,
    type: PubKeyType.VerificationKey2018,
    encoding: Encoding.HEX,
    delegate: issuerAddress,
  };
  const validity = 5 * 60 * 1000; // 5 minutes
  const assetLigthDoc = asset.documentFactory.createLite(new Resolver());
  await assetLigthDoc.read(assetDid);
  let document = assetLigthDoc.didDocument;
  console.log('document before add delegate:', document);
  const assetFullDoc = asset.documentFactory.createFull(new Operator(assetKeys));
  const updated = await assetFullDoc.update(DIDAttribute.Authenticate, updateData, validity);
  await assetLigthDoc.read(assetDid);
  document = assetLigthDoc.didDocument;
  console.log('document after add delegate:', document);
};
exampleTest().then(() => {
  console.log('Finished');
});
const exampleUserCreatesClaim = async () => {
  /**
   * One has to import the keys library
   *
   * If private key is known/saved, one can create Keys instance from existing key:
   * const assetKeys = new Keys({
   *  privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
   *  publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
   * });
   * @type {Keys}
   *
   * Otherwise, one simply creates a new KeyPair
   */
  const newKeys = new Keys();
  // This functionality can be added to Keys package to avoid import from ethers
  const ethereumAddress = new Wallet(newKeys.privateKey).address;
  // Did is associated with Energy Web method and the on-chain address of the user
  const userDid = `did${Networks.EnergyWeb}:${ethereumAddress}`;
  // Creating Sample Issuer and Verifier
  const issuerKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B';
  const issuerDid = `did:${Networks.EnergyWeb}:${issuerAddress}`;
  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  });
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd';
  const verifierDid = `did:${Networks.EnergyWeb}:${verifierAddress}`;
  // User Creates Claim data
  const claimData = {
    name: 'Tesla Model 3',
    capacity: '10',
    price: '500',
  };
  // To create the Registry instance, one has to provide keypair, did, as well as resolver
  const user = new DIDRegistry(newKeys, userDid, new Resolver());
  // User want to create an instance of UserClaims to create public or private claims
  const userClaims = user.claims.createClaimsUser();
  // To generate a public claim (JWT token) one has to provide the Claim Data, and that's it!
  // If the IOT device is present, the user has to send his Address to the device to be signed
  // Once the device signs and returns the signature, it has to be verified.
  // Once verified, it will be added as a field to the claim, binding the owner with the asset
  const publicToken = await userClaims.createPublicClaim(claimData);
  // To generate a private claim user will also have to provide claim issuer's DID
  // Private token and salted fields are returned, which have to be saved to create
  // private claim proofs in the future
  const {
    privateToken,
    saltedFields,
  } = await user.claims.createPrivateClaim(claimData, issuerDid);
  // The code that is used by Issuer to generate Tokens
  const issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver());
  const issuerClaims = issuer.claims.createClaimsIssuer();
  // Issuer generates public token that can be stored by the user
  const issuedPublicToken = await issuerClaims.issuePublicClaim(publicToken);
  // Issuer generates private token that can be stored by the user
  const issuedPrivateToken = await issuerClaims.issuePublicClaim(privateToken);
  // Once the tokens are issued, user has to verify, if it has been done correctly
  // These tokens can be saved in storage, once they pass verification
  // After that the user can send public claim or private claim along with the proof to verifier
  const verifiedPublic = await userClaims.verifyPublicClaim(issuedPublicToken);
  const verifiedPrivate = await userClaims.verifyPrivateClaim(issuedPrivateToken, saltedFields);
  // If someone wants to read other's did, without creating claims or using any other functionality,
  // the registry can be created with an empty constructor
  const registryToFetchDocuments = new DIDRegistry();
  const didLiteDocument = registryToFetchDocuments.read(issuerDid);
  // The document includes the fetched did document. User can read attributes. The method will
  // automatically check if the new data is available in the Blockchain
  const publicKey = didLiteDocument.read('PublicKey', 'veriKey');
  // The method above would return the public key of the did to be used for verification purposes
};



```