import chai, { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import {
  Operator, signerFromKeys, ConnectedSigner, getProvider,
} from '@ew-did-registry/did-ethr-resolver';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import {
  Claims,
  IClaims,
} from '../src';
import { deployRegistry, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.should();

describe('[CLAIMS PACKAGE/CLAIMS]', function () {
  this.timeout(0);
  const keys = new Keys();
  const userAddress = keys.getAddress();
  const userDdid = `did:${Methods.Erc1056}:${userAddress}`;

  let claims: IClaims;

  before(async () => {
    const registry = await deployRegistry([userAddress]);
    const store = new DidStore(await spawnIpfsDaemon());
    const signer = new ConnectedSigner(signerFromKeys(keys), getProvider());
    const userDoc = new DIDDocumentFull(
      userDdid,
      new Operator(signer, { address: registry }),
    );
    claims = new Claims(signer, userDoc, store);

    await userDoc.create();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it.only('Claims instance should have public key', async () => {
    const pubKey = await claims.keys.publicKey;
    expect(pubKey.slice(2)).equal(keys.publicKey.slice(2));
  });
});
