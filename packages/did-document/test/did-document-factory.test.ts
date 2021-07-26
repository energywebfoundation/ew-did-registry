/* eslint-disable no-shadow */
import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import {
  IOperator,
  ProviderSettings,
  ProviderTypes,
} from '@ew-did-registry/did-resolver-interface';
import {
  EwPrivateKeySigner,
  IdentityOwner,
  Operator,
} from '@ew-did-registry/did-ethr-resolver';
import { DIDDocumentFactory } from '../src/factory';
import { DIDDocumentLite } from '../src/lite';
import { DIDDocumentFull } from '../src/full';
import { deployRegistry } from '../../../tests/init-ganache';

const providerSettings : ProviderSettings = {
  type: ProviderTypes.HTTP,
};

describe('[DID DOCUMENT FACTORY]', async () => {
  const keys = new Keys();
  const owner = IdentityOwner.fromPrivateKeySigner(
    new EwPrivateKeySigner(keys.privateKey, providerSettings),
  );
  const address = await owner.getAddress();
  const did = `did:ewc:${address}`;
  let operator: IOperator;

  before(async () => {
    const registry = await deployRegistry([]);
    console.log(`registry: ${registry}`);
    operator = new Operator(
      owner,
      { address: registry },
    );
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
