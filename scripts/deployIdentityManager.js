const {JsonRpcProvider} = require('ethers/providers');

const {ContractFactory, Wallet} = require('ethers');
const {
  abi,
  bytecode,
} = require('../packages/proxyIdentity/build/contracts/IdentityManager.json');
const {
  abi: abiOfferable,
  bytecode: bytecodeOfferable,
} = require('../packages/proxyIdentity/build/contracts/OfferableIdentity.json');

const deployer = new Wallet(
  '9d69bf3c7bda0fc771a59818e5a7f894f3b4fbd3114891db3d4de7f46aa71ca8',
  new JsonRpcProvider('')
);

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
