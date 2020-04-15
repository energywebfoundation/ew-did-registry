import {
  Contract, providers, ContractFactory, ethers,
} from 'ethers';
import Web3 from 'web3';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { BigNumber, Signature } from 'ethers/utils';
import { Keys } from '../../keys';
import { abi as abi1056, bytecode as bytecode1056 } from '../build/contracts/ERC1056.json';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../build/contracts/ProxyIdentity.json';

chai.use(chaiAsPromised);
chai.should();
const web3 = new Web3('http://localhost:8544');

const { JsonRpcProvider } = providers;

describe('[PROXY IDENTITY PACKAGE/PROXY CONTRACT]', function () {
  this.timeout(0);
  let proxy: Contract;
  let erc1056: Contract;
  const provider = new JsonRpcProvider('http://localhost:8544');
  const creator: providers.JsonRpcSigner = provider.getSigner(0);
  let creatorAddress: string;
  const proxyFactory = new ContractFactory(proxyAbi, proxyBytecode, creator);
  const erc1056Factory = new ContractFactory(abi1056, bytecode1056, creator);
  let identity: string;
  let accounts: string[];

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    creatorAddress = await creator.getAddress();
    erc1056 = await (await erc1056Factory.deploy()).deployed();
    proxy = await (await proxyFactory.deploy(erc1056.address)).deployed();
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
        const changeOwnerAbi: any = abi1056.find((f) => f.name === 'changeOwner');
        const data: string = web3.eth.abi.encodeFunctionCall(changeOwnerAbi, [owner, newOwner]);
        return proxy.sendTransaction(data, erc1056.address, 0);
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
    const setAttributeAbi: any = abi1056.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [proxy.address, attribute, value, '1000']);
    proxy.sendTransaction(data, erc1056.address, 0).then((tx: any) => tx.wait());
  });

  it('sendTransaction with setAttribute() calldata from non-owner should revert', () => {
    const setAttributeAbi: any = abi1056.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [proxy.address, attribute, value, '1000']);
    const nonOwned = proxy.connect(provider.getSigner(1));
    return nonOwned.sendTransaction(data, erc1056.address, 0).should.be.rejectedWith('Only owner allowed');
  });

  it('sendSignedTransaction with signed by the owner setAttribute() calldata send from non-owner should emit DIDAttributeChanged on ERC1056', (done) => {
    erc1056.on('DIDAttributeChanged', (id, n, v, validTo, previouse) => {
      erc1056.removeAllListeners('DIDAttributeChanged');
      done();
    });
    const setAttributeAbi: any = abi1056.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [identity, attribute, value, '1000']);
    const nonOwner = provider.getSigner(2);
    nonOwner.getTransactionCount()
      .then(async (nonce) => {
        const digest = ethers.utils.keccak256(
          web3.eth.abi.encodeParameters(
            ['bytes', 'address', 'uint256', 'uint256'],
            [data, erc1056.address, 0, nonce + 1],
          ),
        );
        const flatSignature = await creator.signMessage(ethers.utils.arrayify(digest));
        const expSignature: Signature = ethers.utils.splitSignature(flatSignature);
        const { r, s, v } = expSignature;
        const asNonOwner: Contract = proxy.connect(nonOwner);
        const tx = await asNonOwner.sendSignedTransaction(
          data, erc1056.address, v, r, s, 0, nonce + 1,
        );
        await tx.wait();
      });
  });

  it('sendSignedTransaction with signed by the non-owner setAttribute() calldata should revert', () => {
    const setAttributeAbi: any = abi1056.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [identity, attribute, value, '1000']);
    const digest = ethers.utils.keccak256(data);
    const nonOwner = provider.getSigner(1);
    return nonOwner.signMessage(ethers.utils.arrayify(digest))
      .then(async (flatSignature) => {
        const expSignature: Signature = ethers.utils.splitSignature(flatSignature);
        const { r, s, v } = expSignature;
        return proxy.sendSignedTransaction(
          data, erc1056.address, v, r, s, 0, await creator.getTransactionCount(),
        );
      })
      .should.be.rejectedWith('Signature is not valid');
  });

  it('sendSignedTransaction twice should revert', async () => {
    const setAttributeAbi: any = abi1056.find((f) => f.name === 'setAttribute');
    const attribute = web3.eth.abi.encodeParameter('bytes32', web3.utils.asciiToHex('name'));
    const value = web3.eth.abi.encodeParameter('bytes', web3.utils.asciiToHex('John'));
    const data: string = web3.eth.abi.encodeFunctionCall(setAttributeAbi, [identity, attribute, value, '1000']);
    const nonOwner = provider.getSigner(2);
    const nonce = await nonOwner.getTransactionCount();
    const digest = ethers.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ['bytes', 'address', 'uint256', 'uint256'],
        [data, erc1056.address, 0, nonce],
      ),
    );
    const flatSignature = await creator.signMessage(ethers.utils.arrayify(digest));
    const expSignature: Signature = ethers.utils.splitSignature(flatSignature);
    const { r, s, v } = expSignature;
    const asNonOwner: Contract = proxy.connect(nonOwner);
    const tx = await asNonOwner.sendSignedTransaction(
      data, erc1056.address, v, r, s, 0, nonce,
    );
    await tx.wait();
    return asNonOwner.sendSignedTransaction(
      data, erc1056.address, v, r, s, 0, nonce,
    )
      .should.be.rejectedWith('This transaction has already been sent');
  });

  it('changeOwner() called by recovery agent should add sender to identity delegates', (done) => {
    const agent = provider.getSigner(1);
    const newOwner = accounts[5];
    let agentAddress: string;
    agent.getAddress()
      .then((address) => {
        agentAddress = address;
        erc1056.on('DIDDelegateChanged', (id, type, delegate) => {
          if (delegate === newOwner) {
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
        return asAgent.changeOwner(newOwner);
      })
      .then((tx: any) => {
        return tx.wait();
      })
      .then(() => {
        return proxy.owner();
      })
      .then((owner: string) => {
        owner.should.equal(newOwner);
      })
      .catch(e => expect.fail(e));
  });

  it('changeOwner() called by non-recovery agent should revert', async () => {
    const agent = provider.getSigner(2);
    const asAgent = proxy.connect(agent);
    asAgent.changeOwner(await agent.getAddress()).should.be.rejectedWith('Only recovery agent can change the owner');
  });

  it('along with transaction a value can be send', async () => {
    const payee = accounts[4];
    const balance0 = new BigNumber(await provider.getBalance(payee));
    const pay = '10000000000000000000';
    await (await proxy.sendTransaction('0x0', payee, pay, { value: (new BigNumber(pay)).toHexString() })).wait();
    const balance1 = (await provider.getBalance(payee)).toString();
    expect(balance1.toString()).equal(balance0.add(pay).toString());
  });

  it('along with signed transaction value can be send from proxy', async () => {
    const payee = accounts[4];
    const pay = new BigNumber('1000000000000000000');
    const initialBalance = await provider.getBalance(payee);
    const data = '0x0';
    const nonOwner = provider.getSigner(2);
    const nonce = await nonOwner.getTransactionCount();
    const digest = ethers.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ['bytes', 'address', 'uint256', 'uint256'],
        [data, payee, pay, nonce],
      ),
    );
    const flatSignature = await creator.signMessage(ethers.utils.arrayify(digest));
    const expSignature: Signature = ethers.utils.splitSignature(flatSignature);
    const { r, s, v } = expSignature;
    const asNonOwner: Contract = proxy.connect(nonOwner);
    const tx = await asNonOwner.sendSignedTransaction(
      data, payee, v, r, s, pay, nonce, { value: pay },
    );
    await tx.wait();
    const finalBalance = await provider.getBalance(payee);
    expect(initialBalance.add(pay).eq(finalBalance)).true;
  });

  it('pre-existing balance can be sent', async () => {
    const dest = accounts[2];
    const pay = '10000000000000000000';
    const balance0: BigNumber = new BigNumber(await web3.eth.getBalance(dest));
    await web3.eth.sendTransaction({
      from: accounts[3],
      to: proxy.address,
      value: (new BigNumber(pay)).toHexString(),
    });
    await proxy.sendTransaction('0x0', dest, pay).then((tx: any) => tx.wait());
    const balance1 = await web3.eth.getBalance(dest);
    expect(balance1.toString()).equal(balance0.add(pay).toString());
  });
});
