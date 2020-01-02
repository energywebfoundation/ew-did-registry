/* eslint-disable no-shadow */
import { expect, assert } from 'chai';
import { ethers } from 'ethers';
import { Keys } from '@ew-did-registry/keys';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  Operator,
  PubKeyType,
} from '@ew-did-registry/did-resolver';
import { DIDDocumentFactory } from '../src/factory';
import { DIDDocumentLite } from '../src/lite';
import { DIDDocumentFull } from '../src/full';

describe('[DID DOCUMENT FULL]', function () {
  this.timeout(0);
  const keys = new Keys();
  const { address } = new ethers.Wallet(keys.privateKey);
  const did = `did:ewc:${address}`;
  const operator = new Operator(keys);

  it('createLite should return instance of DIDDocumentLite', () => {
    const factory = new DIDDocumentFactory(did);
    const document = factory.createLite(operator);
    expect(document).to.be.an.instanceOf(DIDDocumentLite);
  });

  it('createFull should return instance of DIDDocumentFull', () => {
    const factory = new DIDDocumentFactory(did);
    const document = factory.createFull(operator);
    expect(document).to.be.an.instanceOf(DIDDocumentFull);
  });

  it('the subject whose did initialized the factory can update the document created by the'
    + ' factory', async () => {
    const keys = new Keys({
      privateKey: '9a843e79a455a368c3031ffc3974e04e04f0553f2464b89074f901dea713c357',
      publicKey: '0361652cea564db2c9ef4d5859705376cbe5628e47490022a3b4535764d3f08efe',
    });
    const operator = new Operator(keys);
    const ownerAddress = '0x0126B7A16967114f3E261c36E9D99629D73caAeA';
    const owner = `did:ewc:${ownerAddress}`;
    const factory = new DIDDocumentFactory(owner);
    const document = factory.createFull(operator);
    const updated = await document.update(
      DIDAttribute.PublicKey,
      {
        algo: Algorithms.ED25519,
        encoding: Encoding.HEX,
        type: PubKeyType.VerificationKey2018,
        value: new Keys().publicKey,
      },
      1 * 60 * 1000,
    );
    expect(updated).is.true;
  });

  it(`the subject which is not owner of the keys with which operator is initialized cannot update
    document created by the factory`, async () => {
    const keys = new Keys({
      privateKey: '9a843e79a455a368c3031ffc3974e04e04f0553f2464b89074f901dea713c357',
      publicKey: '0361652cea564db2c9ef4d5859705376cbe5628e47490022a3b4535764d3f08efe',
    });
    const operator = new Operator(keys);
    const factory = new DIDDocumentFactory(did);
    const document = factory.createFull(operator);
    const updated = await document.update(
      DIDAttribute.PublicKey,
      {
        algo: Algorithms.ED25519,
        encoding: Encoding.HEX,
        type: PubKeyType.VerificationKey2018,
        value: new Keys().publicKey,
      },
      1 * 60 * 1000,
    );
    expect(updated).is.false;
  });
});
