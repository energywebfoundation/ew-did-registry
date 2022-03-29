import { Contract, providers } from 'ethers';
import { expect } from 'chai';

let manager: Contract;
let owner: providers.JsonRpcSigner;
let ownerAddr: string;
let identityFactory: Contract;

export function createIdentityTests(): void {
  before(async function () {
    ({ ownerAddr, manager, owner, identityFactory } = this);
    ownerAddr = await owner.getAddress();
  });

  it('Identity should notify manager when created', async () => {
    const txReceipt = await (await manager.createIdentity(ownerAddr)).wait();
    const {
      args: { owner, identity },
      event,
    } = txReceipt.events[0];

    expect(await identityFactory.attach(identity).owner()).equal(ownerAddr);
    expect(owner).equal(ownerAddr);
    expect(event).equal('IdentityCreated');
  });
}
