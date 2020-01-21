import { expect } from 'chai';
import { Wallet } from 'ethers';
import { Resolver } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';
import { Networks } from '@ew-did-registry/did';
import DIDRegistry from '../src';

describe('[DID-REGISTRY PACKAGE]', () => {
  it('should create a registry class', async () => {
    const user = new Keys();
    const userWallet = new Wallet(user.privateKey);
    const userDid = `ew:${Networks.EnergyWeb}:${userWallet.address}`;
    const userDidPub = `ew:${Networks.EnergyWeb}:0x${user.publicKey}`;
    console.log(userDid);
    const issuer = new Keys();
    const issuerWallet = new Wallet(issuer.privateKey);
    const issuerDid = `did:${Networks.Ethereum}:0x${issuerWallet.address}`;
    const issuerDidPub = `ew:${Networks.EnergyWeb}:0x${issuer.publicKey}`;
    console.log(issuerDid);
    const verifier = new Keys();
    const verifierWallet = new Wallet(issuer.privateKey);
    const verifierDid = `did:${Networks.Ethereum}:0x${verifierWallet.address}`;
    const verifierDidPub = `ew:${Networks.EnergyWeb}:0x${verifier.publicKey}`;
    const resolver = new Resolver();
    const userDidRegistry = new DIDRegistry(user, userDid, resolver);
    const issuerDidRegistry = new DIDRegistry(issuer, issuerDid, resolver);
    const verifierDidRegistry = new DIDRegistry(verifier, verifierDid, resolver);

    const userClaims = userDidRegistry.claims.createClaimsUser(
      userDidRegistry.keys.get(Networks.EnergyWeb),
      userDidRegistry.resolver,
    );

    const issuerClaims = issuerDidRegistry.claims.createClaimsIssuer(
      issuerDidRegistry.keys.get(Networks.EnergyWeb),
      issuerDidRegistry.resolver,
    );

    const verifierClaims = verifierDidRegistry.claims.createClaimsVerifier(
      verifierDidRegistry.keys.get(Networks.EnergyWeb),
      verifierDidRegistry.resolver,
    );

    const claimData = { secret: '123' };
    const {
      token: privateToken,
      saltedFields,
    } = await userClaims.createPrivateClaim(claimData, issuerDidPub);
  });
});
