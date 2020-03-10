import { Contract, providers, ContractFactory } from 'ethers';
import Web3 from 'web3';
import { expect } from 'chai';
import { abi, bytecode } from '../build/contracts/ProxyIdentity.json';
import { ethrReg } from '../../did-resolver';
import { Keys } from '../../keys';

const web3 = new Web3('http://localhost:8544');
const { encodeFunctionCall, encodeParameter } = web3.eth.abi;
const { JsonRpcProvider } = providers;
const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;

describe('[PROXY IDENTITY PACKAGE/PROXY CONTRACT]', function () {
  this.timeout(0);
  let proxy: Contract;
  let erc1056: Contract;
  const provider = new JsonRpcProvider('http://localhost:8544');
  const creator: providers.JsonRpcSigner = provider.getSigner(0);
  const proxyFactory = new ContractFactory(abi, bytecode, creator);
  const erc1056Factory = new ContractFactory(abi1056, bytecode1056, creator);

  beforeEach(async () => {
    proxy = await (await proxyFactory.deploy()).deployed();
    erc1056 = await (await erc1056Factory.deploy()).deployed();
    await creator.sendTransaction({ value: 1000000000, to: proxy.address, gasLimit: 100000 });
  });

  it('sendTransaction with encoded changeOwner() calldata should emit DIDOwnerChanged on ERC1056', (done) => {
    erc1056.on('DIDOwnerChanged', (identity, owner, previousChange) => {
      erc1056.removeAllListeners('DIDOwnerChanged');
      done();
    });
    const newOwnerAddress = new Keys().getAddress();
    erc1056.identityOwner(proxy.address)
      .then((identityOwner: string) => {
        expect(identityOwner).equal(proxy.address);
        const changeOwnerAbi: any = ethrReg.abi.find((f) => f.name === 'changeOwner');
        const data: string = web3.eth.abi.encodeFunctionCall(changeOwnerAbi, [proxy.address, newOwnerAddress]);
        return proxy.sendTransaction(data, erc1056.address);
      })
      .then((tx: any) => tx.wait())
      .then(() => erc1056.identityOwner(proxy.address))
      .then((identityOwner: string) => {
        expect(identityOwner).equal(newOwnerAddress);
      });
  });

  it('sendTransaction with encoded setAttribute() calldata should emit DIDAttributeChanged on ERC1056', (done) => {
    erc1056.on('DIDAttributeChanged', (id, n, v, validTo, previouse) => {
      erc1056.removeAllListeners('DIDAttributeChanged');
      done();
    });
    const setAttributeAbi: any = ethrReg.abi.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [proxy.address, attribute, value, '1000']);
    proxy.sendTransaction(data, erc1056.address).then((tx: any) => tx.wait());
  });
});
