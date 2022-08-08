/* eslint-disable prefer-arrow-callback */
import {
  Contract,
  ContractFactory,
  providers,
  ethers,
  utils,
  constants,
} from 'ethers';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createIdentityTests } from './createIdentityTests';
import { abi as identityAbi } from '../build/contracts/IdentityManager.json';

chai.use(chaiAsPromised);
chai.should();

const { AddressZero } = constants;

export function identityTestSuite(): void {
  let identity: Contract;
  let identityAddr: string;
  let identityFactory: ContractFactory;
  let manager: Contract;
  let owner: ethers.Signer;
  let ownerAddr: string;
  let provider: providers.JsonRpcProvider;
  const identityInterface = new utils.Interface(identityAbi);

  before(async function () {
    ({ identityFactory, ownerAddr, manager, owner, provider } = this);
    ownerAddr = await owner.getAddress();
  });

  describe('[Identity Create]', createIdentityTests);

  describe('[Identity Transfer]', async () => {
    let receiver: providers.JsonRpcSigner;
    let receiverAddr: string;

    before(async function () {
      receiver = provider.getSigner(2);
      receiverAddr = await receiver.getAddress();
    });

    beforeEach(async () => {
      const txReceipt = await manager.createIdentity(ownerAddr);
      identityAddr = (await txReceipt.wait()).events[0].args.identity;
      identity = identityFactory.attach(identityAddr);
    });

    it('Manager should be notified when identity offered', async () => {
      const receipt = await (
        await identity.connect(owner).offer(receiverAddr)
      ).wait();
      const { name, args } = identityInterface.parseLog(receipt.logs[0]);
      expect(name).to.equal('IdentityOffered');
      expect(args.identity).equal(identityAddr);
      expect(args.owner).equal(ownerAddr);
      expect(args.offeredTo).equal(receiverAddr);
    });

    it('Accepting offer should change identity owner', async () => {
      await identity.connect(owner).offer(receiverAddr);
      const receipt = await (
        await identity.connect(receiver).acceptOffer()
      ).wait();

      const { name, args } = identityInterface.parseLog(receipt.logs[0]);
      expect(name).to.equal('IdentityTransferred');
      expect(args.identity).equal(identityAddr);
      expect(args.owner).equal(receiverAddr);
    });

    it('Rejecting offer should remain identity owner', async () => {
      await identity.connect(owner).offer(receiverAddr);
      const receipt = await (
        await identity.connect(receiver).rejectOffer()
      ).wait();

      const { name, args } = identityInterface.parseLog(receipt.logs[0]);
      expect(name).to.equal('IdentityOfferRejected');
      expect(args.identity).equal(identityAddr);
      expect(args.owner).equal(ownerAddr);
      expect(args.offeredTo).equal(receiverAddr);
    });

    it("Can't accept identity offered to other", async () => {
      const nonReceiver = provider.getSigner(3);

      await identity.connect(owner).offer(receiverAddr);
      return identity.connect(nonReceiver).acceptOffer().should.be.rejected;
    });

    it("Can't reject identity offered to other", async () => {
      const nonReceiver = provider.getSigner(3);

      await identity.connect(owner).offer(receiverAddr);
      return identity.connect(nonReceiver).rejectOffer().should.be.rejected;
    });

    it('Offer can be canceled', async () => {
      expect(await identity.offeredTo()).equal(AddressZero);

      await identity.connect(owner).offer(receiverAddr);
      await identity.connect(owner).cancelOffer();

      expect(await identity.offeredTo()).equal(AddressZero);
    });

    it('Identity can be transferred several times', async () => {
      await identity.connect(owner).offer(receiverAddr);
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
