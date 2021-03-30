import { Contract, providers } from 'ethers';
import { expect } from 'chai';

let manager: Contract;
let identity: Contract;
let owner: providers.JsonRpcSigner;
let ownerAddr: string;
let identityFactory: Contract;

function deploymentTests(): void {
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
}

export function deploymentByManagerTests(): void {
  before(async function () {
    ({
      ownerAddr, manager, owner, identityFactory,
    } = this);
    ownerAddr = await owner.getAddress();

    const txReceipt = await manager.createIdentity(ownerAddr);
    const identityAddr = (await txReceipt.wait()).events[0].args.identity;
    identity = identityFactory.attach(identityAddr);
  });

  deploymentTests();
}
