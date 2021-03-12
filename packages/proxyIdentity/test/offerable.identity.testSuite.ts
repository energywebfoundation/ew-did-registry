/* eslint-disable prefer-arrow-callback */
import {
  Contract, ContractFactory, providers, ethers,
} from 'ethers';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

export function identityTestSuite(): void {
  const id = '123';
  let identity: Contract;
  let identityFactory: ContractFactory;
  let manager: Contract;
  let owner: ethers.Signer;
  let ownerAddr: string;
  let provider: providers.JsonRpcProvider;

  before(async function () {
    ({
      identityFactory, ownerAddr, manager, owner, provider,
    } = this);
    ownerAddr = await owner.getAddress();
  });

  describe('[Identity Creation]', async () => {
    before(async () => {
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
    let receiver: providers.JsonRpcSigner;
    let receiverAddr: string;

    before(async function () {
      receiver = provider.getSigner(2);
      receiverAddr = await receiver.getAddress();
    });

    beforeEach(async () => {
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
}
