/**
 * Script to transfer ownership of an UUPS upgradeable contract
 */
 import { IdentityManager__factory } from '../ethers/factories/IdentityManager__factory';
 import { providers, Wallet } from 'ethers';
 
 // Gnosis safe address to transfer the ownership to
 const safeAddress = '0x36164f73b6c6518CE0a5005b662458D2d2CCc5B0';
 
 //deployed proxy contract address for which ownership needs to be changed
 const proxyContractAddress = '0x2d1569f3a2006d21c0dc60eb13c8557b63ce5a8d';
 const ownerPrivateKey = 'key of the current owner of the contract';
 
 const provider = new providers.JsonRpcProvider(
   //'https://volta-rpc.energyweb.org'
   'https://rpc.energyweb.org'
 );
 
 const contractExecuter = new Wallet(ownerPrivateKey).connect(provider);
 
 async function main() {
   //Choose the contract for which ownership needs to be changed
   const identityManager = IdentityManager__factory.connect(
     proxyContractAddress,
     contractExecuter
   );
   console.log('Current owner of the contract : ' + (await identityManager.owner()));
   await identityManager.transferOwnership(safeAddress);
   console.log('New owner of the contract : ' + (await identityManager.owner()));
 }
 
 main();