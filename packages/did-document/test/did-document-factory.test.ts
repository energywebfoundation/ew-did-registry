/* eslint-disable no-shadow */
import { expect } from 'chai';
import { ethers } from 'ethers';
import { Keys } from '@ew-did-registry/keys';
import { IOperator } from '@ew-did-registry/did-resolver-interface';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { DIDDocumentFactory } from '../src/factory';
import { DIDDocumentLite } from '../src/lite';
import { DIDDocumentFull } from '../src/full';
import { getSettings } from '../../../tests/init-ganache';

describe('[DID DOCUMENT FACTORY]', () => {
  const keys = new Keys();
  const { address } = new ethers.Wallet(keys.privateKey);
  const did = `did:ewc:${address}`;

  let operator: IOperator;

  before(async () => {
    const resolverSettings = await getSettings([]);
    console.log(`registry: ${resolverSettings.address}`);
    operator = new Operator(keys, resolverSettings);
  });

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
});
