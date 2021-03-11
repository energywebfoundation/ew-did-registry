import {
  Contract, providers, ContractFactory,
} from 'ethers';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { abi as IMAbi, bytecode as IMBytecode } from '../build/contracts/IdentityManager.json';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../build/contracts/OfferableIdentity.json';

chai.use(chaiAsPromised);
chai.should();

const { JsonRpcProvider } = providers;

describe('[PROXY IDENTITY PACKAGE/OFFERABLE IDENTITY]', function () {
  this.timeout(0);
  let identity: Contract;
  let manager: Contract;
  const provider = new JsonRpcProvider('http://localhost:8544');
  const deployer = provider.getSigner(0);
  const owner = provider.getSigner(1);
  const identityFactory = new ContractFactory(proxyAbi, proxyBytecode, deployer);
  const identityManagerFactory = new ContractFactory(IMAbi, IMBytecode, deployer);
  const id = '123';
  let ownerAddr: string;

  this.beforeAll(async () => {
    ownerAddr = await owner.getAddress();

    manager = await identityManagerFactory.deploy();
  });

  describe('[Identity Creation]', async () => {
    this.beforeAll(async () => {
      identity = await identityFactory.deploy(id, ownerAddr, manager.address);
    });

    it('Identity should notify manager when created', async () => {
      const address = new Promise((resolve) => {
        manager.on('OfferableIdentityCreated', (i) => {
          manager.removeAllListeners('OfferableIdentityCreated');
          resolve(i);
        });
      });

      expect(await address).equal(identity.address);
    });

    it('identity creator should be identity owner', async () => {
      expect(await identity.owner()).equal(ownerAddr);
    });
  });

  describe('[Identity Transfer]', async () => {
    const receiver = provider.getSigner(2);
    let receiverAddr: string;

    beforeEach(async () => {
      receiverAddr = await receiver.getAddress();

      identity = await identityFactory.deploy(id, ownerAddr, manager.address);

      await identity.connect(owner).functions.offer(receiverAddr);
    });

    it('Accepting offer should change identity owner', async () => {
      await identity.connect(receiver).accept();

      expect(await identity.owner()).equal(receiverAddr);
    });

    it('Rejecting offer should remain identity owner', async () => {
      await identity.connect(receiver).reject();

      expect(await identity.owner()).equal(ownerAddr);
    });

    it('Can\'t accept identity offered to other', async () => {
      const nonReceiver = provider.getSigner(3);

      return (identity.connect(nonReceiver).accept()).should.be.rejected;
    });

    it('Can\'t reject identity offered to other', async () => {
      const nonReceiver = provider.getSigner(3);

      return (identity.connect(nonReceiver).reject()).should.be.rejected;
    });
  });
});
