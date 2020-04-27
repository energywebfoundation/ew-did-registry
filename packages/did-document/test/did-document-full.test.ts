import { expect } from 'chai';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IOperator,
  PubKeyType,
  IUpdateData,
} from '@ew-did-registry/did-resolver-interface';
import { Keys } from '@ew-did-registry/keys';
import { Wallet } from 'ethers';
import DIDDocumentFull from '../src/full/documentFull';
import { getSettings } from '../../../tests/init-ganache';
import { IDIDDocumentFull } from '../src/full/interface';

describe('[DID DOCUMENT FULL PACKAGE]', function () {
  this.timeout(0);
  const ownerAddress = '0xed6011BBaB3B98cF955ff271F52B12B94BF9fD28';
  const did = `did:ewc:${ownerAddress}`;
  const keys = new Keys({
    privateKey: '0b4e103fe261142b716fc5c055edf1e70d4665080395dbe5992af03235f9e511',
    publicKey: '02963497c702612b675707c0757e82b93df912261cd06f6a51e6c5419ac1aa9bcc',
  });
  let Document: IDIDDocumentFull;
  let operator: IOperator;
  const validity = 5 * 60 * 1000;

  before(async () => {
    const resolverSettings = await getSettings([ownerAddress]);
    console.log(`registry: ${resolverSettings.address}`);
    operator = new Operator(keys, resolverSettings);
    Document = new DIDDocumentFull(did, operator);
    const created = await Document.create();
    expect(created).to.be.true;
  });

  it('update document public key should return true', async () => {
    const updated = await Document.update(
      DIDAttribute.PublicKey,
      {
        type: PubKeyType.VerificationKey2018,
        algo: Algorithms.ED25519,
        encoding: Encoding.HEX,
        value: {key: `0x${new Keys().publicKey}`, tag:'key1'},
      },
      validity,
    );
    expect(updated).to.be.true;
  });

  it('deactivate document should return true', async () => {
    const deactivated = await Document.deactivate();
    expect(deactivated).to.be.true;
  });

  it('revokeDelegate makes removes authentication method and corresponding public key', async () => {
    const attribute = DIDAttribute.Authenticate;
    const keysDelegate = new Keys();
    const delegate = new Wallet(keysDelegate.privateKey);
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    const updated = await Document.update(attribute, updateData, validity);
    expect(updated).to.be.true;
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let authMethod = document.publicKey.find(
      (pk) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
    );
    expect(authMethod).include({
      type: 'Secp256k1VerificationKey2018',
      controller: did,
      ethereumAddress: updateData.delegate,
    });
    const delegateDid = `did:ewc:${delegate.address}`;
    const revoked = await Document.revokeDelegate(PubKeyType.VerificationKey2018, delegateDid);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    authMethod = document.publicKey.find(
      (pk) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
    );
    expect(authMethod).to.be.undefined;
  });

  it('revokeAttribute provided with PublicKey type removes public key', async () => {
    const keysAttribute = new Keys();
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value:{ key: `0x${keysAttribute.publicKey}`, tag:'key-2'},
    };
    await Document.update(attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.key.slice(2),
    );
    expect(publicKey).to.be.not.null;
    const revoked = await Document.revokeAttribute(attribute, updateData);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.key.slice(2),
    );
    expect(publicKey).to.be.undefined;
  });
});
