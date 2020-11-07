import chai, { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import {
  Operator, signerFromKeys, getProvider, walletPubKey,
  withKey, withProvider,
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
    const owner = withKey(withProvider(signerFromKeys(keys), getProvider()), walletPubKey);
    const userDoc = new DIDDocumentFull(
      userDdid,
      new Operator(owner, { address: registry }),
    );
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
