// eslint-disable-next-line @typescript-eslint/no-var-requires
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

// needs to be updated with actual address
const libraryAddress = '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB';
// eslint-disable-next-line no-undef
const IdentityManager = artifacts.require('IdentityManager');

module.exports = async (deployer) => {
  await deployProxy(IdentityManager, [libraryAddress], { deployer });
};
