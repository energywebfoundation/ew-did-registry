// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from 'chai';
import {
  DID,
  IDID,
  Methods,
  Chain
} from '../src';
import { erc1056tests } from './erc1056.testSuit';

describe('[DID PACKAGE]', () => {
  let instance: IDID;

  beforeEach(() => {
    instance = new DID();
  });

  it('Setting a valid DID should not throw an error', async () => {
    const did = 'did:eth:method_specific_id';
    expect(() => { instance.set(did); }).to.not.throw();
  });

  it('Setting a valid DID with chain name should not throw an error', async () => {
    const did = 'did:eth:ewc:method_specific_id';
    expect(() => { instance.set(did); }).to.not.throw();
  });

  it('Setting a valid DID should return an instance of DID', async () => {
    const did = 'did:eth:method_specific_id';
    expect(instance.set(did)).to.be.instanceOf(DID);
  });

  it('Setting a valid DID with chain name should return an instance of DID', async () => {
    const did = 'did:eth:volta:method_specific_id';
    expect(instance.set(did)).to.be.instanceOf(DID);
  });

  it('Setting DID without id should not throw an error', async () => {
    const did = 'did:mymethod001:';
    expect(() => { instance.set(did); }).to.not.throw();
  });

  it('Setting DID without id should not throw an error', async () => {
    const did = 'did:mymethod001:ewc:';
    expect(() => { instance.set(did); }).to.not.throw();
  });

  it('Setting DID consisting of less then three parts should throw an error', async () => {
    const did = 'did:my_method';
    expect(() => { instance.set(did); }).to.throw('DID must consist of three parts separated by a colon');
  });

  it('Setting DID without method should throw an error', async () => {
    const did = 'did::specific_id';
    expect(() => { instance.set(did); })
      .to
      .throw('Network must not be empty and consist only of lowcase alphanumerical characters');
  });

  it('Setting DID with invalid method should throw an error', async () => {
    const did = 'did:my method:specific_id';
    expect(() => { instance.set(did); })
      .to
      .throw('Network must not be empty and consist only of lowcase alphanumerical characters');
  });

  it('Setting a valid ID and predefined method should not throw an error', async () => {
    const method = Methods.Erc725;
    const id = 'method_specific_id';
    expect(() => { instance.set(method, id); }).to.not.throw();
  });

  it('Setting a valid ID and predefined method and chain name should not throw an error', async () => {
    const method = Methods.Erc725;
    const chain = Chain.EWC;
    const id = 'method_specific_id';
    expect(() => { instance.set(method, chain, id); }).to.not.throw();
  });

  it('Setting a valid ID and not predefined method should not throw an error', async () => {
    const method = 'mymethod001';
    const id = 'method_specific_id';
    expect(() => { instance.set(method, id); }).to.not.throw();
  });

  it('Setting a valid ID and method should return an instance of DID', async () => {
    const method = Methods.Erc725;
    const id = 'method_specific_id';
    expect(instance.set(method, id)).to.be.instanceOf(DID);
  });

  it(
    'Test scenario: setting valid id in both ways should correctly change the state of the DID',
    async () => {
      instance.set(`did:${Methods.Erc725}:id_in_Ethereum`);
      instance.set(Methods.Erc1056, 'id_in_EnergyWeb');
      expect(instance.get(Methods.Erc725))
        .equals(`did:${Methods.Erc725}:id_in_Ethereum`);
      expect(instance.get(Methods.Erc1056))
        .equals(`did:${Methods.Erc1056}:id_in_EnergyWeb`);
    },
  );

  it(
    'Test scenario: setting valid id in both ways with chain name should correctly change the state of the DID',
    async () => {
      instance.set(`did:${Methods.Erc725}:${Chain.EWC}:id_in_Ethereum`);
      instance.set(Methods.Erc1056, Chain.EWC, 'id_in_EnergyWeb');
      expect(instance.get(Methods.Erc725))
        .equals(`did:${Methods.Erc725}:${Chain.EWC}:id_in_Ethereum`);
      expect(instance.get(Methods.Erc1056))
        .equals(`did:${Methods.Erc1056}:${Chain.EWC}:id_in_EnergyWeb`);
    },
  );

  describe('Erc1056 tests', erc1056tests);
});
