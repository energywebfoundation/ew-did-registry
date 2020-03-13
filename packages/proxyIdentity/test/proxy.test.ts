import {
  Contract, providers, ContractFactory, ethers,
} from 'ethers';
import Web3 from 'web3';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Signature } from 'ethers/utils';
import { ethrReg } from '../../did-ethr-resolver';
import { Keys } from '../../keys';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../build/contracts/ProxyIdentity.json';
import { abi as payableAbi, bytecode as payableBytecode } from '../build/contracts/Payable.json';

chai.use(chaiAsPromised);
chai.should();
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
  let creatorAddress: string;
  const proxyFactory = new ContractFactory(proxyAbi, proxyBytecode, creator);
  const erc1056Factory = new ContractFactory(abi1056, bytecode1056, creator);
  const payableFactory = new ContractFactory(payableAbi, payableBytecode, creator);
  let identity: string;

  beforeEach(async () => {
    creatorAddress = await creator.getAddress();
    erc1056 = await (await erc1056Factory.deploy()).deployed();
    proxy = await (await proxyFactory.deploy(erc1056.address, { value: 1E15 })).deployed();
    identity = proxy.address;
  });

  it('proxy creator should be identity owner and delegate', (done) => {
    erc1056.on('DIDDelegateChanged', (id, type, delegate) => {
      erc1056.removeAllListeners('DIDDelegateChanged');
      expect(delegate).equal(creatorAddress);
      done();
    });
    erc1056.identityOwner(identity)
      .then((owner: string) => {
        expect(owner === creatorAddress);
      });
  });

  it('sendTransaction with changeOwner() calldata should emit DIDOwnerChanged on ERC1056', (done) => {
    erc1056.on('DIDOwnerChanged', (id, owner, previousChange) => {
      erc1056.removeAllListeners('DIDOwnerChanged');
      done();
    });
    const newOwner = new Keys().getAddress();
    erc1056.identityOwner(identity)
      .then((owner: string) => {
        const changeOwnerAbi: any = ethrReg.abi.find((f) => f.name === 'changeOwner');
        const data: string = web3.eth.abi.encodeFunctionCall(changeOwnerAbi, [owner, newOwner]);
        return proxy.sendTransaction(data, erc1056.address);
      })
      .then((tx: any) => tx.wait())
      .then(() => erc1056.identityOwner(identity))
      .then((owner: string) => {
        expect(owner).equal(newOwner);
      });
  });

  it('sendTransaction with setAttribute() calldata from identity owner should emit DIDAttributeChanged on ERC1056', (done) => {
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

  it('sendTransaction with setAttribute() calldata from non-owner should revert', () => {
    const setAttributeAbi: any = ethrReg.abi.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [proxy.address, attribute, value, '1000']);
    const nonOwned = proxy.connect(provider.getSigner(1));
    return nonOwned.sendTransaction(data, erc1056.address).should.be.rejectedWith('Only owner allowed');
  });

  it('sendSignedTransaction with signed by the owner setAttribute() calldata should emit DIDAttributeChanged on ERC1056', (done) => {
    erc1056.on('DIDAttributeChanged', (id, n, v, validTo, previouse) => {
      erc1056.removeAllListeners('DIDAttributeChanged');
      done();
    });
    const setAttributeAbi: any = ethrReg.abi.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [identity, attribute, value, '1000']);
    const digest = ethers.utils.keccak256(data);
    creator.signMessage(ethers.utils.arrayify(digest))
      .then((flatSignature) => {
        const expSignature: Signature = ethers.utils.splitSignature(flatSignature);
        const { r, s, v } = expSignature;
        return proxy.sendSignedTransaction(data, erc1056.address, v, r, s);
      })
      .then((tx: any) => tx.wait());
  });

  it('sendSignedTransaction with signed by the non-owner setAttribute() calldata should revert', () => {
    const setAttributeAbi: any = ethrReg.abi.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [identity, attribute, value, '1000']);
    const digest = ethers.utils.keccak256(data);
    const nonOwner = provider.getSigner(1);
    return nonOwner.signMessage(ethers.utils.arrayify(digest))
      .then((flatSignature) => {
        const expSignature: Signature = ethers.utils.splitSignature(flatSignature);
        const { r, s, v } = expSignature;
        return proxy.sendSignedTransaction(data, erc1056.address, v, r, s);
      })
      .should.be.rejectedWith('Signature is not valid');
  });

  it('changeOwner() called by recovery agent should add sender to identity delegates', (done) => {
    const agent = provider.getSigner(1);
    let agentAddress: string;
    agent.getAddress()
      .then((address) => {
        agentAddress = address;
        erc1056.on('DIDDelegateChanged', (id, type, delegate) => {
          if (delegate === agentAddress) {
            erc1056.removeAllListeners('DIDDelegateChanged');
            done();
          }
        });
      })
      .then(() => {
        return proxy.addRecoveryAgent(agentAddress);
      })
      .then((tx: any) => {
        return tx.wait();
      })
      .then(() => {
        const asAgent = proxy.connect(agent);
        return asAgent.changeOwner();
      })
      .then((tx: any) => {
        return tx.wait();
      })
      .then(() => {
        return proxy.owner();
      })
      .then((owner: string) => {
        owner.should.equal(agentAddress);
      });
  });

  it('along with transaction a value may be send', async () => {
    const payable = await (await payableFactory.deploy()).deployed();
    const balanceBefore: number = await (await provider.getBalance(payable.address)).toNumber();
    const pay = 1E3;
    // console.log('.....balance before payMe():', balanceBefore);
    const payMe: any = payableAbi.find((f) => f.name === 'payMe');
    const data: string = web3.eth.abi.encodeFunctionCall(payMe, []);
    await (await proxy.sendTransaction(data, payable.address, { value: pay })).wait();
    const balanceAfter = await (await provider.getBalance(payable.address)).toNumber();
    // console.log('.....balance after payMe():', balanceAfter);
    expect(balanceAfter).equal(balanceBefore + pay);
  });
});
