import { Contract, providers, ContractFactory, Signer } from 'ethers';
import Web3 from 'web3';
import { abi, bytecode } from '../build/contracts/ProxyIdentity.json';
import { ethrReg } from '../../did-resolver';
import { Keys } from '../../keys';

const { JsonRpcProvider } = providers;
const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;

describe.skip('[PROXY IDENTITY PACKAGE/PROXY]', () => {
  let proxy: Contract;
  let erc1056: Contract;
  const provider = new JsonRpcProvider('http://localhost:8544');
  const creator: Signer = provider.getSigner(0);
  const proxyFactory = new ContractFactory(abi, bytecode, creator);
  const erc1056Factory = new ContractFactory(abi1056, bytecode1056, creator);
  const web3 = new Web3('http://localhost:8544');

  before(async () => {
    const creatorAddress = await creator.getAddress();
    console.log('>> Creator:', creatorAddress);
    proxy = await (await proxyFactory.deploy()).deployed();
    console.log('>> Proxy:', proxy.address);
    erc1056 = await (await erc1056Factory.deploy()).deployed();
    console.log('>> ERC1056:', erc1056.address);
  });

  it('proxy owner must be proxy creator', async () => {
    proxy.once('IdentityOwner', (identty, success) => console.log('identityOwner success:', success));
    // const ownersAbi = ethrReg.abi.find((f) => f.name === 'owners');
    // const data: string = web3.eth.abi.encodeFunctionCall(ownersAbi as any, [proxy.address]);
    const tx = await proxy.identityOwner(proxy.address, erc1056.address);
    await tx.wait();
  });

  it('changeOwner() should emit DIDOwnerChanged on ERC1056', async () => {
    const newOwnerAddress = new Keys().getAddress();
    console.log('new owner address;', newOwnerAddress);
    erc1056.once('DIDOwnerChanged', (id, owner) => console.log(`>>> owner of ${id} changed to ${owner}`));
    proxy.once('TransactionSend', async (data, address, success) => {
      console.log(`>>> send transaction ${data} to ${address} with ${success}`);
      const proxyOwner = await erc1056.identityOwner(proxy.address);
      console.log('owner after change:', proxyOwner);
    });
    const changeOwnerAbi = ethrReg.abi.find((f) => f.name === 'changeOwner');
    const proxyOwner = await erc1056.identityOwner(proxy.address);
    console.log('owner before change:', proxyOwner);
    const data: string = web3.eth.abi.encodeFunctionCall(changeOwnerAbi as any, [proxy.address, newOwnerAddress]);
    const sig = web3.eth.abi.encodeFunctionSignature(changeOwnerAbi as any);
    console.log('change owner signature:', sig);
    await (await proxy.execute(data, erc1056.address, await creator.getAddress(), newOwnerAddress)).wait();
  });
});
