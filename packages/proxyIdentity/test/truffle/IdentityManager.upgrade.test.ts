const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { assert } = require('chai');

const IdentityManager = artifacts.require('IdentityManager');
const IdentityManagerUpgradeTest = artifacts.require('IdentityManagerUpgradeTest');

contract('ClaimManager Upgrade Test', async () => {
  it('should upgrade contract', async () => {
    // using random addresses for testing
    const identityManager = await deployProxy(IdentityManager, ["0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"]);
    const firstVersion = await identityManager.version();

    assert.equal(firstVersion, 'v0.1');

    const upgradedIdentityManager = await upgradeProxy(
        identityManager.address,
        IdentityManagerUpgradeTest
        );
    const secondVersion = await upgradedIdentityManager.version();

    assert.equal(secondVersion, 'v0.2');
  });
});