// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, assert } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import Operator from '../src/models/operator';
import { ProviderTypes } from '../src/models';
import RegistryContractAbi from './RegistryContractAbi';

const { fail } = assert;
describe('[DID-OPERATOR]', () => {
  const keys = new Keys({
    privateKey: '9a843e79a455a368c3031ffc3974e04e04f0553f2464b89074f901dea713c357',
    publicKey: '0361652cea564db2c9ef4d5859705376cbe5628e47490022a3b4535764d3f08efe',
  });
  const operator = new Operator(keys);
  const identity = '0x0126B7A16967114f3E261c36E9D99629D73caAeA';

  it('update attribute should resolve with true', async () => {
    const did = `did:eth:${identity}`;
    const attribute = 'test name';
    const value = 'test value';
    const validity = 100;
    const result = await operator.update(did, attribute, value, validity);
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.true;
  });

  it('setting public key attribute should update DID document', async () => {
    const did = `did:eth:${identity}`;
    const attribute = 'publicKey';
    const value = [
      {
        id: `${did}keys-1`,
        type: 'RsaVerificationKey2019',
        controller: did,
        publicKeyPem: 'BEGIN PUBLIC KEY...END PUBLIC KEY',
      },
    ];
    const validity = 100;
    // const result = await operator.update(did, attribute, value, validity);
    // const document = await operator.read(did);
    // expect(document.id).to.equal(identity);
    // expect(document.publicKey).to.equal(value);
  });

  it('setting attribute on invalid did should throw an error', async () => {
    const did = `did:${identity}`;
    const attribute = 'test name';
    const value = 'test value';
    const validity = 100;
    try {
      await operator.update(did, attribute, value, validity);
      fail('Error was not thrown');
    } catch (e) {
      expect(e.message).to.equal('Invalid DID');
    }
  });

  it(
    'setting attribute with name taking more than 31 bytes should throw an error',
    async () => {
      const did = `did:eth:${identity}`;
      const attribute = 'A'.repeat(32);
      const value = 'test value';
      const validity = 100;
      try {
        await operator.update(did, attribute, value, validity);
        fail(
          'The error "bytes32 string must be less than 32 bytes" was not thrown',
        );
      } catch (e) {
        expect(e.message)
          .to
          .equal('bytes32 string must be less than 32 bytes');
      }
    },
  );

  it('setting attribute with negative validity should throw an error', async () => {
    const did = `did:eth:${identity}`;
    const attribute = 'test name';
    const value = 'test value';
    const validity = -1;
    try {
      await operator.update(did, attribute, value, validity);
      fail(
        'The error "Validity must be non negative value" was not thrown',
      );
    } catch (e) {
      expect(e.message).to.equal('Validity must be non negative value');
    }
  });

  it('deactivating of active document should resolve with true', async () => {
    // const did = `did:eth:${identity}`;
    // const document = await operator.read(did);
    // console.dir(document);
    //   const validity = 0;
    //   const result = await operator.deactivate(did);
    //   expect(result).to.be.true;
  });

  it('deactivating of inactive document should throw an error', async () => {
    //   const did = `did:eth:${identity}`;
    //   const document = operator.read(did);
    //   const validity = 0;
    //   const result = await operator.deactivate(did);
    //   try {
    //     await operator.deactivate(did);
    //   } catch (e) {
    //     expect(e.message).to.equal('Document not active');
    //   }
  });
});
