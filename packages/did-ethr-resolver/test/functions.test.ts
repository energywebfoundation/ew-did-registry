import { IDIDLogData } from '@ew-did-registry/did-resolver-interface';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { documentFromLogs } from '../src';

describe('documentFromLogs', () => {
  it('obtaining document twice from same logs should return the same document', async () => {
    const logs: IDIDLogData[] = [{
      owner: '0x0000000000000000000000000000000000000000',
      topBlock: BigNumber.from('0xe34915'),
      authentication: {
      },
      publicKey: {
        'did:ethr:volta:0x5F7B380b0c8962496f85572074b5C9461C08bbb4#key-owner': {
          id: 'did:ethr:volta:0x5F7B380b0c8962496f85572074b5C9461C08bbb4#key-owner',
          type: 'Secp256k1veriKey',
          controller: '0x5F7B380b0c8962496f85572074b5C9461C08bbb4',
          validity: BigNumber.from('0x20000061b08e7b'),
          block: 14895381,
          publicKeyHex: '039ff520614041598142a6ca5aacd873e48e81d68485559d4c4b53e5835393a84a',
        },
      },
      service: {
        '8258ac3b-e36a-465b-8668-a60cc0c2b00a': {
          type: 'some-type',
          id: '8258ac3b-e36a-465b-8668-a60cc0c2b00a',
          serviceEndpoint: 'QmQidC7fvZKUYajbf8HXW537Gp2Nim2Bmfk5eMrcFXSRH7',
          hash: '237f4ebb6ed606ba29f5511d5e90338fc266ff714177be5661ba540d547b65a8',
          hashAlg: 'SHA256',
          validity: BigNumber.from('0x2000006179a924'),
          block: 14231840,
        },
      },
      attributes: {
      } as Map<string, {
        [key: string]: string | number | unknown;
      }>,
    }];
    const did = 'did:ethr:volta:0x5F7B380b0c8962496f85572074b5C9461C08bbb4';
    const wrappedDoc = documentFromLogs(did, logs);
    const wrappedAgain = documentFromLogs(did, logs);
    expect(wrappedDoc).to.eql(wrappedAgain);
  });
});
