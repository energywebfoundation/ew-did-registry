import { expect } from 'chai';
import {
  Algorithms, DIDAttribute, Encoding, IOperator, Operator, PubKeyType,
} from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';
import DIDDocumentFull from '../src/full/documentFull';
import { getSettings } from '../../../tests/init-ganache';

describe('[DID DOCUMENT FULL PACKAGE]', function () {
  this.timeout(0);
  const ownerAddress = '0xed6011BBaB3B98cF955ff271F52B12B94BF9fD28';
  const did = `did:ewc:${ownerAddress}`;
  const keys = new Keys({
    privateKey: '0b4e103fe261142b716fc5c055edf1e70d4665080395dbe5992af03235f9e511',
    publicKey: '02963497c702612b675707c0757e82b93df912261cd06f6a51e6c5419ac1aa9bcc',
  });

  let operator: IOperator;

  before(async () => {
    const resolverSettings = await getSettings([ownerAddress]);
    console.log(`registry: ${resolverSettings.address}`);
    operator = new Operator(keys, resolverSettings);
  });

  it('create document should return true', async () => {
    const document = new DIDDocumentFull(did, operator);
    const created = await document.create();
    expect(created).to.be.true;
  });

  it('update document public key should return true', async () => {
    const document = new DIDDocumentFull(did, operator);
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

  it('deactivate document should return true', async () => {
    const document = new DIDDocumentFull(did, operator);
    await document.create();
    const deactivated = await document.deactivate();
    expect(deactivated).to.be.true;
  });
});
