/* eslint-disable prefer-arrow-callback */
import { Contract, ContractFactory, providers, ethers } from 'ethers';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { deploymentByManagerTests } from './deploymentTests';

chai.use(chaiAsPromised);
chai.should();

const emptyAddress = `0x${'0'.repeat(40)}`;

export function identityTestSuite(): void {
  let identity: Contract;
  let identityFactory: ContractFactory;
  let manager: Contract;
  let owner: ethers.Signer;
  let ownerAddr: string;
  let provider: providers.JsonRpcProvider;

  before(async function () {
    ({ identityFactory, ownerAddr, manager, owner, provider } = this);
    ownerAddr = await owner.getAddress();
  });

  describe('[Identity Creation]', function () {
    describe('[Deployment by Manager]', deploymentByManagerTests);
  });

  describe('[Identity Transfer]', async () => {
    let receiver: providers.JsonRpcSigner;
    let receiverAddr: string;

    before(async function () {
      receiver = provider.getSigner(2);
      receiverAddr = await receiver.getAddress();
    });

    beforeEach(async () => {
      const txReceipt = await manager.createIdentity(ownerAddr);
      const identityAddr = (await txReceipt.wait()).events[0].args.identity;
      identity = identityFactory.attach(identityAddr);

      await identity.connect(owner).functions.offer(receiverAddr);
    });

    it('Manager should be notified when identity offered', async () => {
      const event = await new Promise((resolve) => {
        manager.on('IdentityOffered', (offered, _owner, offeredTo) => {
          manager.removeAllListeners('IdentityOffered');
          resolve({ offered, _owner, offeredTo });
        });
      });

      expect(event).to.deep.equal({
        offered: identity.address,
        _owner: ownerAddr,
        offeredTo: receiverAddr,
      });
    });

    it('Accepting offer should change identity owner', async () => {
      const event = new Promise((resolve) => {
        manager.on('IdentityTransferred', (offered, offeredTo) => {
          manager.removeAllListeners('IdentityTransferred');
          resolve({ offered, offeredTo });
        });
      });

      await identity.connect(receiver).acceptOffer();

      expect(await event).to.deep.equal({
        offered: identity.address,
        offeredTo: receiverAddr,
      });
      expect(await identity.owner()).equal(receiverAddr);
    });

    it('Rejecting offer should remain identity owner', async () => {
      const event = new Promise((resolve) => {
        manager.on('IdentityOfferRejected', (offered, _owner, offeredTo) => {
          manager.removeAllListeners('IdentityOfferRejected');
          resolve({ offered, _owner, offeredTo });
        });
      });

      await identity.connect(receiver).rejectOffer();

      expect(await event).to.deep.equal({
        offered: identity.address,
        _owner: ownerAddr,
        offeredTo: receiverAddr,
      });
      expect(await identity.owner()).equal(ownerAddr);
    });

    it("Can't accept identity offered to other", async () => {
      const nonReceiver = provider.getSigner(3);

      return identity.connect(nonReceiver).acceptOffer().should.be.rejected;
    });

    it("Can't reject identity offered to other", async () => {
      const nonReceiver = provider.getSigner(3);

      return identity.connect(nonReceiver).rejectOffer().should.be.rejected;
    });

    it('Offer can be canceled', async () => {
      expect(await identity.offeredTo()).equal(receiverAddr);

      await identity.connect(owner).cancelOffer();

      expect(await identity.offeredTo()).equal(emptyAddress);
    });

    it('Identity can be transferred several times', async () => {
      await identity.connect(receiver).acceptOffer();

      expect(await identity.owner()).equal(receiverAddr);
      expect(await manager.identityOwner(identity.address)).equal(receiverAddr);

      const receiver2 = provider.getSigner(3);
      const receiver2Addr = await receiver2.getAddress();
      await identity.connect(receiver).offer(receiver2Addr);
      await identity.connect(receiver2).acceptOffer();

      expect(await identity.owner()).equal(receiver2Addr);
      expect(await manager.identityOwner(identity.address)).equal(
        receiver2Addr
      );
    });
  });
}
