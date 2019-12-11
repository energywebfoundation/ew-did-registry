// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from 'chai';
import { DID, IDID } from '../src';
import { Networks } from '../src/models';

describe('[DID PACKAGE]', () => {
  let instance: IDID;

  beforeEach(() => {
    instance = new DID();
  });

  it('Setting a valid DID should not throw an error', async () => {
    const did = 'did:eth:method_specific_id';
    expect(() => { instance.set(did); }).to.not.throw();
  });

  it('Setting a valid DID should return an instance of DID', async () => {
    const did = 'did:eth:method_specific_id';
    expect(instance.set(did)).to.be.instanceOf(DID);
  });

  it('Setting DID without id should not throw an error', async () => {
    const did = 'did:my_method:';
    expect(() => { instance.set(did); }).to.not.throw();
  });

  it('Setting DID consisting of less then three parts should throw an error', async () => {
    const did = 'did:my_method';
    expect(() => { instance.set(did); }).to.throw('DID must consist of three parts separated by a colon');
  });

  it('Setting DID without network should throw an error', async () => {
    const did = 'did::specific_id';
    expect(() => { instance.set(did); })
      .to
      .throw('Network must not be empty and consist only of lowcase alphanumerical characters');
  });

  it('Setting a valid ID and predefined network should not throw an error',
    async () => {
      const network = Networks.Ethereum;
      const id = 'method_specific_id';
      expect(() => { instance.set(network, id); }).to.not.throw();
    });

  it('Setting a valid ID and not predefined network should not throw an error',
    async () => {
      const network = 'my_network';
      const id = 'method_specific_id';
      expect(() => { instance.set(network, id); }).to.not.throw();
    });

  it('Setting a valid ID and network should return an instance of DID',
    async () => {
      const network = Networks.Ethereum;
      const id = 'method_specific_id';
      expect(instance.set(network, id)).to.be.instanceOf(DID);
    });

  it('Test scenario: setting valid id in both ways should correctly change the state of the DID',
    async () => {
      instance.set(`did:${Networks.Ethereum}:id_in_Ethereum`);
      instance.set(Networks.EnergyWeb, 'id_in_EnergyWeb');
      expect(instance.get(Networks.Ethereum))
        .equals(`did:${Networks.Ethereum}:id_in_Ethereum`);
      expect(instance.get(Networks.EnergyWeb))
        .equals(`did:${Networks.EnergyWeb}:id_in_EnergyWeb`);
    });
});
