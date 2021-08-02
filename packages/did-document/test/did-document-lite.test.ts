import { expect } from 'chai';
import {
  DIDAttribute, PubKeyType, Algorithms, Encoding, IOperator,
} from '@fl-did-registry/did-resolver-interface';
import { Methods } from '@fl-did-registry/did';
import { Keys } from '@fl-did-registry/keys';
import {
  getProvider, signerFromKeys, Operator,
  walletPubKey,
} from '@fl-did-registry/did-nft-resolver';

import { withKey, withProvider } from '@fl-did-registry/did-nft-resolver/src';
import { deployRegistry } from '../../../tests/init-ganache';
import { DIDDocumentLite, IDIDDocumentLite } from '../src';

describe('[DID DOCUMENT LITE PACKAGE]', function () {
  this.timeout(0);
  const keys = new Keys();
  const did = `did:${Methods.Erc1056}:${keys.getAddress()}`;
  let operator: IOperator;
  let docLite: IDIDDocumentLite;

  before(async () => {
    const registry = await deployRegistry([keys.getAddress()]);
    operator = new Operator(
      withKey(withProvider(signerFromKeys(keys), getProvider()), walletPubKey),
      { address: registry },
    );
    docLite = new DIDDocumentLite(did, operator);
  });

  it('returned document should contain standard attributes', async () => {
    const doc = await docLite.read();
    expect(doc).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('document id should be equal to did', async () => {
    const doc = await docLite.read();
    const { id } = doc;
    expect(id).to.equal(did);
  });

  it('public key should be read by its type', async () => {
    await operator.update(did, DIDAttribute.PublicKey, {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-4' },
    });
    const publicKey = await docLite.readAttribute({ publicKey: { type: `${Algorithms.ED25519}${PubKeyType.VerificationKey2018}` } });
    expect(publicKey).to.be.not.undefined;
  });

  it('service endpoint should be read by its url', async () => {
    const url = 'http://test.com';
    await operator.update(did, DIDAttribute.ServicePoint, {
      type: PubKeyType.VerificationKey2018,
      value: { serviceEndpoint: url },
    });
    const service = await docLite.readAttribute({ service: { serviceEndpoint: url } });
    expect(service).to.be.not.undefined;
  });

  it('null should be return when attribute not found', async () => {
    const attr = await docLite.readAttribute({ service: { nonexist: 'nonexist' } });
    expect(attr).to.be.undefined;
  });

  it('owner public key should be returned from created document', async () => {
    await operator.create();
    expect(await docLite.ownerPubKey(did)).equal(keys.publicKey);
  });

  it('owner public key should be undefined on deactivated document', async () => {
    await operator.deactivate(did);
    expect(await docLite.ownerPubKey(did)).undefined;
  });
});
