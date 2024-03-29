import { expect } from 'chai';
import { Keys, KeyType } from '@ew-did-registry/keys';
import { Contract, ContractFactory, Wallet } from 'ethers';
import {
  DIDAttribute,
  Encoding,
  PubKeyType,
  IOperator,
  ProviderTypes,
  ProviderSettings,
} from '@ew-did-registry/did-resolver-interface';
import { EwSigner } from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did-resolver-interface/node_modules/@ew-did-registry/did';
import { Suite } from 'mocha';
import { OfferableIdenitytOperator } from '../src/offerableIdentityOperator';
import { replenish } from '../../../tests/init-ganache';
import { OnlyOwnerAllowed } from '../src/errors';

const { PublicKey } = DIDAttribute;
const { Secp256k1, ED25519 } = KeyType;
const { VerificationKey2018 } = PubKeyType;
const { HEX } = Encoding;

export function offerableIdentityOperatorTestSuite(this: Suite): void {
  this.timeout(0);
  let operator: IOperator;
  const validity = 10 * 60 * 1000;
  let did: string;
  let identityFactory: ContractFactory;
  let identity: Contract;
  let manager: Contract;
  let owner: EwSigner;
  let ownerAddr: string;
  let erc1056: Contract;
  const providerSettings: ProviderSettings = {
    type: ProviderTypes.HTTP,
  };

  beforeEach(async function () {
    ({ identityFactory, manager, erc1056 } = this);
    const keys = new Keys();
    owner = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);
    ownerAddr = await owner.getAddress();
    await replenish([ownerAddr]);

    const txReceipt = await manager.createIdentity(ownerAddr);
    const identityAddr = (await txReceipt.wait()).events[0].args.identity;
    identity = identityFactory.attach(identityAddr);
    did = `did:${Methods.Erc1056}:${identity.address}`;

    operator = new OfferableIdenitytOperator(
      owner,
      { address: erc1056.address },
      identity.address
    );
  });

  it('updating of non-owned identity should be rejected', async () => {
    const updateData = {
      algo: Secp256k1,
      type: VerificationKey2018,
      encoding: HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-0' },
    };
    const did = `did:${Methods.Erc1056}:${Wallet.createRandom().address}`;
    return expect(
      operator.update(did, PublicKey, updateData, validity)
    ).rejectedWith(OnlyOwnerAllowed);
  });

  it('public key can be added', async () => {
    const attribute = PublicKey;
    const updateData = {
      algo: Secp256k1,
      type: VerificationKey2018,
      encoding: HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-2' },
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey
    );
    expect(publicKey).is.not.undefined;
  });

  it('service endpoint can be added', async () => {
    const attribute = DIDAttribute.ServicePoint;
    const endpoint = 'https://test.algo.com';
    const serviceId = 'UserClaimURL3';
    const updateData = {
      type: attribute,
      value: {
        id: `${did}#service-${serviceId}`,
        type: 'ClaimStore',
        serviceEndpoint: endpoint,
      },
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    expect(document.service.find((sv) => sv.serviceEndpoint === endpoint)).not
      .undefined;
  });

  it('public key can be revoked', async () => {
    const attribute = PublicKey;
    const updateData = {
      algo: ED25519,
      type: VerificationKey2018,
      encoding: HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-6' },
    };
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey
    );
    expect(publicKey).to.be.not.null;
    const revoked = await operator.revokeAttribute(did, attribute, updateData);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey
    );
    expect(publicKey).to.be.undefined;
  });
}
