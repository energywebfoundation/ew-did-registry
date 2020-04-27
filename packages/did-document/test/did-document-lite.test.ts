import { expect } from 'chai';
import { DIDAttribute, PubKeyType, Algorithms, Encoding, IOperator } from '@ew-did-registry/did-resolver-interface';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did';
import { Keys } from '@ew-did-registry/keys';
import { getSettings } from '../../../tests/init-ganache';
import { DIDDocumentLite, IDIDDocumentLite } from '../src';

describe('[DID DOCUMENT LITE PACKAGE]', function () {
  this.timeout(0);
  const keys = new Keys();
  const did = `did:${Methods.Erc1056}:${keys.getAddress()}`;
  let operator: IOperator;
  let docLite: IDIDDocumentLite;

  before(async () => {
    const resolverSettings = await getSettings([keys.getAddress()]);
    operator = new Operator(keys, resolverSettings);
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

  it('readAttribute should find public key', async () => {
    await operator.update(did, DIDAttribute.PublicKey, {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: {key: `0x${new Keys().publicKey}`, tag:'key-4'},
    });
    const publicKey = await docLite.readAttribute({ publicKey: { type: 'Secp256k1VerificationKey' } });
    expect(publicKey).to.be.not.undefined;
  });

  it('readAttribute should find service endpoint', async () => {
    const url = 'http://test.com';
    await operator.update(did, DIDAttribute.ServicePoint, {
      type: PubKeyType.VerificationKey2018,
      value:{svcEndPoint: url},
    });
    const service = await docLite.readAttribute({ serviceEndpoints: { serviceEndpoint: url } });
    expect(service).to.be.not.undefined;
  });

  it('invalid attribute should return null', async () => {
    const attr = await docLite.readAttribute({ serviceEndpoints: { nonexist: 'nonexist' } });
    expect(attr).to.be.null;
  });
});
