import chai, { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { Operator, IdentityOwner, EwPrivateKeySigner } from '@ew-did-registry/did-ethr-resolver';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import {
  Claims,
  IClaims,
} from '../src';
import { deployRegistry, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';
import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';

chai.should();

describe('[CLAIMS PACKAGE/CLAIMS]', function () {
  this.timeout(0);
  const keys = new Keys();
  const userAddress = keys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;
  const providerSettings: ProviderSettings = {
    type: ProviderTypes.HTTP,
  };

  let claims: IClaims;

  before(async () => {
    const registry = await deployRegistry([userAddress]);
    const store = new DidStore(await spawnIpfsDaemon());
    const signer = new EwPrivateKeySigner(keys.privateKey, providerSettings);
    const owner = IdentityOwner.fromPrivateKeySigner(signer);
    const operator = new Operator(
      owner,
      { address: registry },
    );
    const userDoc = new DIDDocumentFull(userDid, operator);
    claims = new Claims(owner, userDoc, store);

    await userDoc.create();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('Claims instance should have public key', async () => {
    const pubKey = claims.keys.publicKey;
    expect(pubKey.slice(2)).equal(keys.publicKey.slice(2));
  });
});
