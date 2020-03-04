import { Keys } from '@ew-did-registry/keys';
import { Networks } from '@ew-did-registry/did';
import { expect } from 'chai';
import {
  Operator,
  IResolverSettings,
  DIDAttribute,
  IUpdateData,
  Algorithms,
  PubKeyType,
  Encoding,
  IAuthentication,
  IServiceEndpoint,
} from '../src';

import { getSettings } from '../../../tests/init-ganache';

describe.only('[DID-RESOLVER-READ-ATTRIBUTES]', function () {
  this.timeout(0);
  const keys = new Keys({
    privateKey: '49d484400c2b86a89d54f26424c8cbd66a477a6310d7d4a3ab9cbd89633b902c',
    publicKey: '023d6e5b341099c21cd4093ebe3228dc80a2785479b8211d20399698f61ee264d0',
  });
  let operator: Operator;
  let operatorSetting: IResolverSettings;
  const identity = '0x37155f6d56b3be462bbd6b154c5E960D19827167';
  const validity = 10 * 60 * 1000;
  const did = `did:ewc:${identity}`;

  before(async () => {
    operatorSetting = await getSettings([identity, '0xe8Aa15Dd9DCf8C96cb7f75d095DE21c308D483F7']);
    operator = new Operator(keys, operatorSetting);
  });

  it('readAttribute should read public key by its hex value and type', async () => {
    const attribute = DIDAttribute.PublicKey;
    const k = new Keys();
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: `0x${k.publicKey}`,
    };
    await operator.update(did, attribute, updateData, validity);
    const publicKeyAttr = await operator.readAttribute(did, { publicKey: { publicKeyHex: updateData.value, type: `${updateData.algo}${updateData.type}` } });
    console.log('publicKeyAttr:', publicKeyAttr);
    expect(publicKeyAttr.publicKeyHex === updateData.value);
  });

  it('readAttribute should read service endpoint', async () => {
    const attribute = DIDAttribute.ServicePoint;
    const endpoint = 'https://test.readAttribute.com';
    const updateData: IUpdateData = {
      type: PubKeyType.VerificationKey2018,
      value: endpoint,
    };
    await operator.update(did, attribute, updateData, validity);
    const serviceEndpointAttr = await operator.readAttribute(did, { serviceEndpoints: { serviceEndpoint: `${updateData.value}` } }) as IServiceEndpoint;
    expect(serviceEndpointAttr.serviceEndpoint === updateData.value);
  });

  it('readAttribute should read delegate by given Ethereum address', async () => {
    const attribute = DIDAttribute.Authenticate;
    const delegate = new Keys();
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: delegate.getAddress(),
    };
    await operator.update(did, attribute, updateData, validity);
    await operator.read(did);
    const delegateAttr = await operator.readAttribute(did, {
      publicKey: {
        ethereumAddress: `${delegate.getAddress()}`,
      },
    }) as IAuthentication;
    expect(delegateAttr.publicKey === updateData.delegate);
  });
});
