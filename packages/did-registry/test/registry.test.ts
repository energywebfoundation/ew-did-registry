import { expect } from 'chai';
import {
  Resolver, Operator, DIDAttribute, IUpdateData, PubKeyType, Algorithms, Encoding,
} from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';
import { Networks } from '@ew-did-registry/did';
import { IClaim } from '@ew-did-registry/claims';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import DIDRegistry from '../src';

describe('[REGISTRY PACKAGE]', function () {
  this.timeout(0);
  const userKeys = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const userDid = `did:${Networks.Ethereum}:${userAddress}`;
  const userOperator = new Operator(userKeys);

  const issuerKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B';
  const issuerDid = `did:${Networks.Ethereum}:${issuerAddress}`;

  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  });
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd';
  const verifierDid = `did:${Networks.EnergyWeb}:${verifierAddress}`;
  const user = new DIDRegistry(userKeys, userDid, new Resolver());
  const userClaims = user.claims.createClaimsUser();
  const issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver());
  const issuerClaims = issuer.claims.createClaimsIssuer();
  const verifier = new DIDRegistry(verifierKeys, verifierDid, new Resolver());
  const validity = 5 * 60 * 1000; // 5 minutes

  before(async () => {
    await userOperator.deactivate(userDid);
    await userOperator.create();
  });

  it('user public claim should be issued and verified', async () => {
    const publicData = {
      name: 'Tesla Model 3',
      capacity: '10',
      price: '500',
    };
    const token = await userClaims.createPublicClaim(publicData);
    // send token to Issuer
    const issuedToken = await issuerClaims.issuePublicClaim(token);
    // send to Verifier/Owner
    const verified = await userClaims.verifyPublicClaim(issuedToken);
    // expect(verified).is.true;
    const claim: IClaim = userClaims.jwt.decode(issuedToken) as IClaim;
    expect(claim.did).equal(userDid);
    expect(claim.signer).equal(issuerDid);
    expect(claim.publicData).deep.equal(publicData);
    // Issued token valid, issuer can be added to delegates
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: issuerAddress,
    };
    const userLigthDoc = user.documentFactory.createLite(new Resolver());
    await userLigthDoc.read(userDid);
    let document = userLigthDoc.didDocument;
    // console.log('document before add delegate:', document);
    const userFullDoc = user.documentFactory.createFull(new Operator(userKeys));
    expect(userFullDoc).instanceOf(DIDDocumentFull);
    await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity);
    await userLigthDoc.read(userDid);
    document = userLigthDoc.didDocument;
    // console.log('Issuer did:', issuerDid);
    // console.log('document after add delegate:', document);
  });

  it('user can prove his ownership of his issued and verified private claim', async () => {
    const privateData = {
      secret: '123',
    };
    const { token, saltedFields } = await userClaims.createPrivateClaim({}, privateData, issuerDid);
    // send token to Issuer
    const issuedToken = await issuerClaims.issuePrivateClaim(token);
    // send to Verifier/Owner
    let verified = await userClaims.verifyPrivateClaim(issuedToken, saltedFields);
    // expect(verified).is.true;
    const claim: IClaim = userClaims.jwt.decode(issuedToken) as IClaim;
    expect(claim.did).equal(userDid);
    expect(claim.signer).equal(issuerDid);
    // Issued token valid, issuer can be added to delegates
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: issuerAddress,
    };
    const userLigthDoc = user.documentFactory.createLite(new Resolver());
    await userLigthDoc.read(userDid);
    let document = userLigthDoc.didDocument;
    const userFullDoc = user.documentFactory.createFull(userOperator);
    expect(userFullDoc).instanceOf(DIDDocumentFull);
    const updated = await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity);
    expect(updated).is.true;
    await userLigthDoc.read(userDid);
    const expectedPkId = `${userDid}#delegate-${PubKeyType.VerificationKey2018}-${issuerAddress}`;
    expect(document.publicKey.find((pk) => pk.id === expectedPkId)).to.not.undefined;
    const proofToken = await userClaims.createProofClaim('http://claim.url', saltedFields);
    verified = await verifier.claims.createClaimsVerifier().verifyPrivateProof(proofToken, issuedToken);
    // expect(verified).is.true;
    document = userLigthDoc.didDocument;
  });
});
