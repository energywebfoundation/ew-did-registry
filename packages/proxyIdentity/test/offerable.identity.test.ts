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
      const event = new Promise((resolve) => {
        manager.on('IdentityCreated', (created) => {
          manager.removeAllListeners('IdentityCreated');
          resolve(created);
        });
      });

      expect(await event).equal(identity.address);
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

    it('Manager should be notified when identity offered', async () => {
      const event = await new Promise((resolve) => {
        manager.on('IdentityOffered', (offered, offeredTo) => {
          manager.removeAllListeners('IdentityOffered');
          resolve({ offered, offeredTo });
        });
      });

      expect(event).to.deep.equal({ offered: identity.address, offeredTo: receiverAddr });
    });

    it('Accepting offer should change identity owner', async () => {
      const event = new Promise((resolve) => {
        manager.on('IdentityTransferred', (offered, offeredTo) => {
          manager.removeAllListeners('IdentityTransferred');
          resolve({ offered, offeredTo });
        });
      });

      await identity.connect(receiver).accept();

      expect(await event).to.deep.equal({ offered: identity.address, offeredTo: receiverAddr });
      expect(await identity.owner()).equal(receiverAddr);
    });

    it('Rejecting offer should remain identity owner', async () => {
      const event = new Promise((resolve) => {
        manager.on('OfferRejected', (offered, offeredTo) => {
          manager.removeAllListeners('OfferRejected');
          resolve({ offered, offeredTo });
        });
      });

      await identity.connect(receiver).reject();

      expect(await event).to.deep.equal({ offered: identity.address, offeredTo: receiverAddr });
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
