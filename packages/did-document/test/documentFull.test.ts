import { expect } from 'chai';
import {
  Algorithms, DIDAttribute, Encoding, Operator, PubKeyType,
} from '@ew-did-registry/did-resolver';
import DIDDocumentFull from '../src/full/documentFull';
import { Keys } from '../../keys/dist';

describe.skip('add function', () => {
  const ownerAddress = '0x0126B7A16967114f3E261c36E9D99629D73caAeA';
  const did = `did:ewc:${ownerAddress}`;
  const keys = new Keys({
    privateKey: '9a843e79a455a368c3031ffc3974e04e04f0553f2464b89074f901dea713c357',
    publicKey: '0361652cea564db2c9ef4d5859705376cbe5628e47490022a3b4535764d3f08efe',
  });
  const operator = new Operator(keys);

  it('create should return true', async () => {
    const document = await new DIDDocumentFull(did, operator);
    const created = document.create();
    expect(created).to.be.true;
  });

  it('update public key should return true', async () => {
    const document = await new DIDDocumentFull(did, operator);
    await document.create();
    const validity = 5 * 60 * 1000;
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
    expect(updated).to.be.true;
  });

  it('deactivate should return true', async () => {
    const document = await new DIDDocumentFull(did, operator);
    await document.create();
    const deactivated = await document.deactivate();
    expect(deactivated).to.be.true;
  });
});
