const { JsonRpcProvider } = require('ethers/providers');

const { ContractFactory, Wallet } = require('ethers');
const {
  abi,
  bytecode,
} = require('../packages/proxyIdentity/build/contracts/IdentityManager.json');
const {
  abi: abiOfferable,
  bytecode: bytecodeOfferable,
} = require('../packages/proxyIdentity/build/contracts/OfferableIdentity.json');
const { createWallet } = require('../tests/init-ganache');

const deployer = await createWallet();

const identityManagerFactory = new ContractFactory(abi, bytecode, deployer);
const identityLibraryFactory = new ContractFactory(
  abiOfferable,
  bytecodeOfferable,
  deployer
);

identityLibraryFactory
  .deploy()
  .then((library) => library.deployed())
  .then((library) => identityManagerFactory.deploy(library.address))
  .then((manager) => manager.deployed())
  .then((manager) => console.log(`manager deployed on ${manager.address}`));
