import chai, { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { Operator, EwSigner } from '@ew-did-registry/did-ethr-resolver';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import { ChildProcess } from 'child_process';
import { Claims, IClaims } from '../src';
import {
  deployRegistry,
  shutdownIpfsCluster,
  spawnIpfsCluster,
} from '../../../tests';
import {
  ProviderSettings,
  ProviderTypes,
} from '@ew-did-registry/did-resolver-interface';

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
  let cluster: ChildProcess;

  before(async () => {
    const registry = await deployRegistry([userAddress]);
    cluster = await spawnIpfsCluster();
    const store = new DidStore('http://localhost:8080');
    const signer = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);
    const operator = new Operator(signer, { address: registry });
    const userDoc = new DIDDocumentFull(userDid, operator);
    claims = new Claims(signer, userDoc, store);

    await userDoc.create();
  });

  after(async () => {
    shutdownIpfsCluster(cluster);
  });

  it('Claims instance should have public key', async () => {
    const pubKey = claims.keys.publicKey;
    expect(pubKey.slice(2)).equal(keys.publicKey.slice(2));
  });
});
