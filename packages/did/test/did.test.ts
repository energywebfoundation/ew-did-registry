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

  it('Setting a valid DID should return an instanse of DID', async () => {
    const did = 'did:eth:method_specific_id';
    expect(instance.set(did)).to.be.instanceOf(DID);
  });

  it('Setting malformed DID should throw an error', async () => {
    const did = 'INVALID:DID';
    expect(() => { instance.set(did); }).to.throw('Wrong DID scheme');
  });

  it('Setting DID with malformed network should throw an error', async () => {
    const did = 'did:my network:specific_id';
    expect(() => { instance.set(did); }).to.throw('Wrong DID scheme');
  });

  it('Setting DID with nonexistent network should throw an error', async () => {
    const did = 'did:my_network:specific_id';
    expect(() => { instance.set(did); }).to.throw('Invalid network');
  });

  it('Setting a valid ID and network should not throw an error',
    async () => {
      const network = Networks.Ethereum;
      const id = 'method_specific_id';
      expect(() => { instance.set(network, id); }).to.not.throw();
    });

  it('Setting a valid ID and network should not return an instance of DID',
    async () => {
      const network = Networks.Ethereum;
      const id = 'method_specific_id';
      expect(instance.set(network, id)).to.be.instanceOf(DID);
    });

  it('Setting a valid ID and invalid network should throw an error',
    async () => {
      const network = 'Unknown';
      const id = 'method_specific_id';
      expect(
        () => { instance.set(network as Networks, id); },
      )
        .to.throw('Invalid network');
    });

  it('Test scenario: setting id in both ways should correctly change the state of the DID',
    async () => {
      instance.set(`did:${Networks.Ethereum}:id_in_Ethereum`);
      instance.set(Networks.EnergyWeb, 'id_in_EnergyWeb');
      expect(instance.get(Networks.Ethereum))
        .equals(`did:${Networks.Ethereum}:id_in_Ethereum`);
      expect(instance.get(Networks.EnergyWeb))
        .equals(`did:${Networks.EnergyWeb}:id_in_EnergyWeb`);
    });
});
