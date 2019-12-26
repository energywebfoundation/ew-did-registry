import { expect } from 'chai';


import { Resolver } from '@ew-did-registry/did-resolver';

import { DIDDocumentLite, IDIDDocumentLite } from '../src/lite';

describe('[DID DOCUMENT LITE PACKAGE]', function() {
  this.timeout(60000);
  let didDocumentLite: IDIDDocumentLite;
  let wrongDidDocumentLite: IDIDDocumentLite;
  const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
  const wrongId = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a394~';

  before(() => {
    const resolver = new Resolver();
    didDocumentLite = new DIDDocumentLite(did, resolver);
    wrongDidDocumentLite = new DIDDocumentLite(wrongId, resolver);
  });

  it('before first read did-document should be undefined', async () => {
    expect(didDocumentLite.didDocument).to.be.undefined;
  });

  it('read should fetch did-document', async () => {
    await didDocumentLite.read('id');
    expect(didDocumentLite.didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('returned id should be equal to did', async () => {
    const id = await didDocumentLite.read('id');
    expect(id).to.deep.equal(did);
  });

  it('returned publicKey should represent the owner', async () => {
    const publicKey = await didDocumentLite.read('publicKey', 'Secp256k1VerificationKey2018');
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(publicKey.id).to.deep.equal(`${did}#owner`);
  });

  it('invalid attribute should return undefined', async () => {
    const wrongKey = await didDocumentLite.read('privateKey');
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(wrongKey).to.be.undefined;
  });

  it('valid attribute with wrong type should return undefined', async () => {
    const wrongKey = await didDocumentLite.read('publicKey', 'ImpossibleKey');
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(wrongKey).to.be.undefined;
  });

  it('invalid attribute with wrong type should return undefined', async () => {
    const wrongKey = await didDocumentLite.read('privateKey', 'ImpossibleKey');
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(wrongKey).to.be.undefined;
  });
});
