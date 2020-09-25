import chai, { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import { Signer, Wallet } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import {
  Claims,
  IClaims,
} from '../src';
import { getSettings, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.should();

describe('[CLAIMS PACKAGE/CLAIMS]', function () {
  this.timeout(0);
  const keys = new Keys();
  const userAddress = keys.getAddress();
  const userDdid = `did:${Methods.Erc1056}:${userAddress}`;

  let claims: IClaims;

  before(async () => {
    const resolverSettings = await getSettings([userAddress]);
    console.log(`registry: ${resolverSettings.address}`);

    const store = new DidStore(await spawnIpfsDaemon());
    const userDoc = new DIDDocumentFull(userDdid, new Operator(keys, resolverSettings));
    const signer: Signer = new Wallet(keys.privateKey, new JsonRpcProvider(
      resolverSettings.provider.uriOrInfo,
      resolverSettings.provider.network,
    ));
    claims = new Claims(signer, userDoc, store);

    await userDoc.create();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('Claims instance should have public key', async () => {
    const pubKey = await claims.keys.publicKey;
    expect(pubKey.slice(2)).equal(keys.publicKey.slice(2));
  });
});
