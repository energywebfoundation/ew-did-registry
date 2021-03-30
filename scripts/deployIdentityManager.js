const { JsonRpcProvider } = require('ethers/providers');

const { ContractFactory, Wallet } = require('ethers');
const { abi, bytecode } = require('../packages/proxyIdentity/build/contracts/IdentityManager.json');

const deployer = new Wallet(
  '9d69bf3c7bda0fc771a59818e5a7f894f3b4fbd3114891db3d4de7f46aa71ca8',
  new JsonRpcProvider(''),
);

const identityManagerFactory = new ContractFactory(abi, bytecode, deployer);
identityManagerFactory.deploy().then((manager) => {
  console.log(`manager deployed on ${manager.address}`);
});
