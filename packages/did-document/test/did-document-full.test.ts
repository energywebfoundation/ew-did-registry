/* eslint-disable no-restricted-syntax */
import chai, { expect, should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
  Operator, signerFromKeys, getProvider,
  walletPubKey,
  withKey, withProvider,
} from '@ew-did-registry/did-ethr-resolver';
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
import { deployRegistry } from '../../../tests/init-ganache';
import { IDIDDocumentFull } from '../src/full/interface';

should();
chai.use(chaiAsPromised);

describe('[DID DOCUMENT FULL PACKAGE]', function () {
  this.timeout(0);
  const ownerAddress = '0xed6011BBaB3B98cF955ff271F52B12B94BF9fD28';
  const did = `did:ewc:${ownerAddress}`;
  const keys = new Keys({
    privateKey: '0b4e103fe261142b716fc5c055edf1e70d4665080395dbe5992af03235f9e511',
    publicKey: '02963497c702612b675707c0757e82b93df912261cd06f6a51e6c5419ac1aa9bcc',
  });
  const keys1 = new Keys();
  let fullDoc: IDIDDocumentFull;
  let operator: IOperator;
  let registry: string;
  const validity = 5 * 60 * 1000;

  before(async () => {
    registry = await deployRegistry([ownerAddress, keys1.getAddress()]);
    console.log(`registry: ${registry}`);
    operator = new Operator(
      withKey(withProvider(signerFromKeys(keys), getProvider()), walletPubKey),
      { address: registry },
    );
    fullDoc = new DIDDocumentFull(did, operator);
    const created = await fullDoc.create();
    expect(created).to.be.true;
  });

  it('update document public key should return true', async () => {
    const updated = await fullDoc.update(
      DIDAttribute.PublicKey,
      {
        type: PubKeyType.VerificationKey2018,
        algo: Algorithms.ED25519,
        encoding: Encoding.HEX,
        value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-1' },
      },
      validity,
    );
    expect(updated.toNumber()).to.be.an('number');
  });

  it('document can be deactivated', async () => fullDoc.deactivate().should.be.fulfilled);

  it('revokeDelegate removes authentication method and corresponding public key', async () => {
    const attribute = DIDAttribute.Authenticate;
    const keysDelegate = new Keys();
    const delegate = new Wallet(keysDelegate.privateKey);
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    await fullDoc.update(attribute, updateData, validity);
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
    const revoked = await fullDoc.revokeDelegate(PubKeyType.VerificationKey2018, delegateDid);
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
      value: { publicKey: `0x${keysAttribute.publicKey}`, tag: 'key-2' },
    };
    await fullDoc.update(attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey.slice(2),
    );
    expect(publicKey).to.be.not.null;
    const revoked = await fullDoc.revokeAttribute(attribute, updateData);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey.slice(2),
    );
    expect(publicKey).to.be.undefined;
  });

  it('should be possible to add 10 public keys', async () => {
    const count = 10;
    const keyBefore = (await fullDoc.read()).publicKey.length;
    const tags = new Array(count).fill(0).map((k, i) => i.toString());
    for await (const tag of tags) {
      await fullDoc.update(
        DIDAttribute.PublicKey,
        {
          type: PubKeyType.VerificationKey2018,
          algo: Algorithms.ED25519,
          encoding: Encoding.HEX,
          value: { publicKey: `0x${new Keys().publicKey}`, tag },
        },
        validity,
      );
    }
    const keyAfter = (await fullDoc.read()).publicKey.length;
    expect(keyAfter).equal(keyBefore + count);
  });

  it('public key with expired validity should be invalidated', async () => {
    const tag = 'test';
    const keyId = `${did}#${tag}`;
    const shortValidity = 1;
    await fullDoc.update(
      DIDAttribute.PublicKey,
      {
        type: PubKeyType.VerificationKey2018,
        algo: Algorithms.ED25519,
        encoding: Encoding.HEX,
        value: { publicKey: `0x${new Keys().publicKey}`, tag: 'test' },
      },
      shortValidity,
    );
    await new Promise((resolve) => {
      setTimeout(resolve, (shortValidity * 1.1) * 1000);
    });
    expect(await fullDoc.readAttribute({ publicKey: { id: keyId } })).undefined;
  });

  it('adding of one delegate with two different types should add two public keys', async () => {
    const attribute = DIDAttribute.Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    const keysBefore = (await fullDoc.read()).publicKey.length;
    await fullDoc.update(attribute, updateData, validity);
    await fullDoc.update(
      attribute,
      { ...updateData, type: PubKeyType.SignatureAuthentication2018 },
      validity,
    );
    const keysAfter = (await fullDoc.read()).publicKey.length;
    expect(keysAfter).equal(keysBefore + 2);
  });

  it('document must not be updated by non-owning identity', async () => {
    const doc = new DIDDocumentFull(
      did,
      new Operator(
        withKey(withProvider(signerFromKeys(keys1), getProvider()), walletPubKey),
        { address: registry },
      ),
    );
    return doc.deactivate().should.be.rejected;
  });

  it('document be can read from specified block', async () => {
    let i = 0;

    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: `key-${i}` },
    };
    const firstBlock = await fullDoc.update(DIDAttribute.PublicKey, updateData, validity);

    i += 1;
    updateData.value = { publicKey: `0x${new Keys().publicKey}`, tag: `key-${i}` };
    const secondBlock = await fullDoc.update(DIDAttribute.PublicKey, updateData);
    i += 1;
    updateData.value = { publicKey: `0x${new Keys().publicKey}`, tag: `key-${i}` };
    const thirdBlock = await fullDoc.update(DIDAttribute.PublicKey, updateData);

    expect((await fullDoc.readFromBlock(did, firstBlock)).publicKey.length).equal(3);
    expect((await fullDoc.readFromBlock(did, secondBlock)).publicKey.length).equal(2);
    expect((await fullDoc.readFromBlock(did, thirdBlock)).publicKey.length).equal(1);
  });

  it('each identity update should increment its last block', async () => {
    const from = await fullDoc.lastBlock(did);

    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-1' },
    };

    await fullDoc.update(DIDAttribute.PublicKey, updateData, validity);
    expect((await fullDoc.lastBlock(did)).eq(from.add(1)));

    await fullDoc.update(DIDAttribute.PublicKey, updateData, validity);
    expect((await fullDoc.lastBlock(did)).eq(from.add(2)));
  });
});
