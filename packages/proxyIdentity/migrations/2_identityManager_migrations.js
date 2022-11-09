// eslint-disable-next-line @typescript-eslint/no-var-requires
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

// needs to be updated with actual address
const libraryAddress = '0x4c392f00a17B1b77aB059E6dc9ccE91F74113c66';
// eslint-disable-next-line no-undef
const IdentityManager = artifacts.require('IdentityManager');

module.exports = async (deployer) => {
  await deployProxy(IdentityManager, [libraryAddress], {
    deployer,
    kind: 'uups',
  });
};
