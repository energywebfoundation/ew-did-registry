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
  const assetKeys = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const assetAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const assetDid = `did:${Networks.Ethereum}:${assetAddress}`;
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

  it('Asset can save its data in the DID registry', async () => {
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
    expect(verified).is.true;
    const claim: IClaim = assetClaims.jwt.decode(issuedToken) as IClaim;
    expect(claim.did).equal(assetDid);
    expect(claim.signer).equal(issuerDid);
    expect(claim.claimData).deep.equal(claimData);
    // Issued token valid, issuer can be added to delegates
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: issuerAddress,
    };
    const validity = 5 * 60 * 1000; // 5 minutes
    const assetLigthDoc = asset.documentFactory.createLite(new Resolver());
    await assetLigthDoc.read(assetDid);
    let document = assetLigthDoc.didDocument;
    // console.log('document before add delegate:', document);
    const assetFullDoc = asset.documentFactory.createFull(new Operator(assetKeys));
    expect(assetFullDoc).instanceOf(DIDDocumentFull);
    const updated = await assetFullDoc.update(DIDAttribute.Authenticate, updateData, validity);
    await assetLigthDoc.read(assetDid);
    document = assetLigthDoc.didDocument;
    // console.log('Issuer did:', issuerDid);
    // console.log('document after add delegate:', document);
  });
});
