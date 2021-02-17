import {
  Contract, providers, ContractFactory, utils,
} from 'ethers';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '../../keys';
import { abi as abi1056, bytecode as bytecode1056 } from '../build/contracts/ERC1056.json';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../build/contracts/ProxyIdentity.json';
import { abi as tokenERC1155Abi, bytecode as tokenERC1155Bytecode } from '../build/contracts/ERC1155MintBurn.json';
import { abi as abi1155, bytecode as bytecode1155 } from '../build/contracts/ERC1155Multiproxy.json';
import { abi as tokenERC223Abi, bytecode as tokenERC223Bytecode } from '../build/contracts/ERC223Mintable.json';

const {
  BigNumber, bigNumberify, Interface, arrayify, keccak256, defaultAbiCoder,
  splitSignature, formatBytes32String,
} = utils;

chai.use(chaiAsPromised);
chai.should();

const { JsonRpcProvider } = providers;
const encoder = utils.defaultAbiCoder;

describe('[PROXY IDENTITY PACKAGE/PROXY CONTRACT]', function () {
  this.timeout(0);
  let proxy: Contract;
  let erc1056: Contract;
  let erc1155: Contract;
  const provider = new JsonRpcProvider('http://localhost:8544');
  const creator: providers.JsonRpcSigner = provider.getSigner(0);
  let creatorAddr: string;
  const proxyFactory = new ContractFactory(proxyAbi, proxyBytecode, creator);
  const erc1056Factory = new ContractFactory(abi1056, bytecode1056, creator);
  const erc1155Factory = new ContractFactory(abi1155, bytecode1155, creator);
  const tokenERC1155Factory = new ContractFactory(tokenERC1155Abi, tokenERC1155Bytecode, creator);
  let identity: string;
  const serial = '123';

  beforeEach(async () => {
    creatorAddr = await creator.getAddress();
    erc1056 = await (await erc1056Factory.deploy()).deployed();
    erc1155 = await (await erc1155Factory.deploy()).deployed();
    proxy = await proxyFactory.deploy(erc1056.address, erc1155.address, serial, creatorAddr);
    identity = proxy.address;
  });

  it('proxy creator should be identity owner and delegate', (done) => {
    erc1056.on('DIDDelegateChanged', (id, type, delegate) => {
      erc1056.removeAllListeners('DIDDelegateChanged');
      expect(delegate).equal(creatorAddr);
      done();
    });
    erc1056.identityOwner(identity)
      .then((owner: string) => {
        expect(owner === creatorAddr);
      });
  });

  it('sendTransaction with changeOwner() calldata should emit DIDOwnerChanged on ERC1056', (done) => {
    erc1056.on('DIDOwnerChanged', () => {
      erc1056.removeAllListeners('DIDOwnerChanged');
      done();
    });
    const newOwner = new Keys().getAddress();
    erc1056.identityOwner(identity)
      .then((owner: string) => {
        const data = new Interface(abi1056).functions.changeOwner.encode([owner, newOwner]);
        return proxy.sendTransaction(data, erc1056.address, 0);
      })
      .then((tx: any) => tx.wait())
      .then(() => erc1056.identityOwner(identity))
      .then((owner: string) => {
        expect(owner).equal(newOwner);
      });
  });

  it('sendTransaction with setAttribute() calldata from identity owner should emit DIDAttributeChanged on ERC1056', (done) => {
    erc1056.on('DIDAttributeChanged', () => {
      erc1056.removeAllListeners('DIDAttributeChanged');
      done();
    });
    const attribute = utils.formatBytes32String('name');
    const value = encoder.encode(['bytes'], [`0x${Buffer.from('John').toString('hex')}`]);
    const data = new Interface(abi1056).functions.setAttribute.encode([proxy.address, attribute, value, '1000']);
    proxy.sendTransaction(data, erc1056.address, 0).then((tx: any) => tx.wait());
  });

  it('sendTransaction with setAttribute() calldata from non-owner should revert', () => {
    const attribute = utils.formatBytes32String('name');
    const value = encoder.encode(['bytes'], [`0x${Buffer.from('John').toString('hex')}`]);
    const data = new Interface(abi1056).functions.setAttribute.encode([proxy.address, attribute, value, '1000']);
    const nonOwned = proxy.connect(provider.getSigner(1));
    return nonOwned.sendTransaction(data, erc1056.address, 0).should.be.rejectedWith('Only owner allowed');
  });

  it('sendSignedTransaction with signed by the owner setAttribute() calldata send from non-owner should emit DIDAttributeChanged on ERC1056', (done) => {
    erc1056.on('DIDAttributeChanged', () => {
      erc1056.removeAllListeners('DIDAttributeChanged');
      done();
    });
    const attribute = utils.formatBytes32String('name');
    const value = encoder.encode(['bytes'], [`0x${Buffer.from('John').toString('hex')}`]);
    const data = new Interface(abi1056).functions.setAttribute.encode([proxy.address, attribute, value, '1000']);
    const nonOwner = provider.getSigner(2);
    nonOwner.getTransactionCount()
      .then(async (nonce) => {
        const digest = keccak256(defaultAbiCoder.encode(
          ['bytes', 'address', 'uint256', 'uint256'],
          [data, erc1056.address, 0, nonce + 1],
        ));
        const flatSignature = await creator.signMessage(arrayify(digest));
        const expSignature: utils.Signature = splitSignature(flatSignature);
        const { r, s, v } = expSignature;
        const tx = await proxy.connect(nonOwner).sendSignedTransaction(
          data, erc1056.address, v, r, s, 0, nonce + 1,
        );
        await tx.wait();
      });
  });

  it('sendSignedTransaction with signed by the non-owner setAttribute() calldata should revert', () => {
    const attribute = formatBytes32String('name');
    const value = encoder.encode(['bytes'], [`0x${Buffer.from('John').toString('hex')}`]);
    const data = new Interface(abi1056).functions.setAttribute.encode([identity, attribute, value, '1000']);
    const digest = keccak256(data);
    const nonOwner = provider.getSigner(1);
    return nonOwner.signMessage(arrayify(digest))
      .then(async (flatSignature) => {
        const expSignature: utils.Signature = splitSignature(flatSignature);
        const { r, s, v } = expSignature;
        return proxy.sendSignedTransaction(
          data, erc1056.address, v, r, s, 0, await creator.getTransactionCount(),
        );
      })
      .should.be.rejectedWith('VM Exception while processing transaction: revert Signature is not valid');
  });

  it('sendSignedTransaction twice should revert', async () => {
    const attribute = utils.formatBytes32String('name');
    const value = encoder.encode(['bytes'], [`0x${Buffer.from('John').toString('hex')}`]);
    const data = new Interface(abi1056).functions.setAttribute.encode([identity, attribute, value, '1000']);
    const nonOwner = provider.getSigner(2);
    const nonce = await nonOwner.getTransactionCount();
    const digest = keccak256(
      encoder.encode(
        ['bytes', 'address', 'uint256', 'uint256'],
        [data, erc1056.address, 0, nonce],
      ),
    );
    const flatSignature = await creator.signMessage(arrayify(digest));
    const expSignature: utils.Signature = splitSignature(flatSignature);
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

  it('along with transaction a value can be send', async () => {
    const payee = await provider.getSigner(4).getAddress();
    const balance0 = new BigNumber(await provider.getBalance(payee));
    const pay = '10000000000000000000';
    await (await proxy.sendTransaction('0x0', payee, pay, { value: (new BigNumber(pay)).toHexString() })).wait();
    const balance1 = (await provider.getBalance(payee)).toString();
    expect(balance1.toString()).equal(balance0.add(pay).toString());
  });

  it('along with signed transaction value can be send from proxy', async () => {
    const payee = await provider.getSigner(4).getAddress();
    const pay = new BigNumber('1000000000000000000');
    const initialBalance = await provider.getBalance(payee);
    const data = '0x0';
    const nonOwner = provider.getSigner(2);
    const nonce = await nonOwner.getTransactionCount();
    const digest = keccak256(
      utils.defaultAbiCoder.encode(
        ['bytes', 'address', 'uint256', 'uint256'],
        [data, payee, pay, nonce],
      ),
    );
    const flatSignature = await creator.signMessage(arrayify(digest));
    const expSignature: utils.Signature = splitSignature(flatSignature);
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
    const dest = await provider.getSigner(2).getAddress();
    const pay = '10000000000000000000';
    const balance0: utils.BigNumber = new BigNumber(
      await provider.getBalance(dest),
    );
    await provider.getSigner(3).sendTransaction({
      to: proxy.address,
      value: bigNumberify(pay),
    });
    await proxy.sendTransaction('0x0', dest, pay).then((tx: any) => tx.wait());
    const balance1 = await provider.getBalance(dest);
    expect(balance1.toString()).equal(balance0.add(pay).toString());
    expect(balance1.eq(balance0));
  });

  it('ERC1155 token should be transfered to the proxy contract and returned by it', async () => {
    const amount = 100;
    let token = await (await tokenERC1155Factory.deploy()).deployed();
    const minter = provider.getSigner(3);
    token = token.connect(minter);
    const minterAddr = await minter.getAddress();
    await token.mint(minterAddr, 1, 1000, '0x0');
    await token.safeTransferFrom(
      minterAddr,
      identity,
      1,
      amount,
      '0x0',
    );
    expect((await token.balanceOf(identity, 1)).toNumber()).equal(amount);
    expect((await token.balanceOf(minterAddr, 1)).toNumber()).equal(1000 - amount);
    const data = new Interface(tokenERC1155Abi).functions.safeTransferFrom.encode([identity, minterAddr, 1, amount, '0x0']);
    await proxy.sendTransaction(data, token.address, 0, { gasLimit: 100000 })
      .then((tx: any) => tx.wait());
    expect((await token.balanceOf(identity, 1)).toNumber()).equal(0);
    expect((await token.balanceOf(minterAddr, 1)).toNumber()).equal(1000);
  });

  it('ERC1155 tokens should be transfered batched to proxy owner', async () => {
    const amount1 = 100;
    const amount2 = 200;
    let token = await (await tokenERC1155Factory.deploy()).deployed();
    const minter = provider.getSigner(3);
    token = token.connect(minter);
    const minterAddr = await minter.getAddress();
    await token.batchMint(minterAddr, [1, 2], [1000, 2000], '0x0');
    await token.safeBatchTransferFrom(
      minterAddr,
      identity,
      [1, 2],
      [amount1, amount2],
      '0x0',
    );
    const balances = await token.balanceOfBatch([identity, identity], [1, 2]);
    expect(balances.map((b: utils.BigNumber) => b.toNumber())).deep.equal([amount1, amount2]);
  });

  it('when ERC223 tokens transfered to proxy and returned by it', async () => {
    const amount = 100;
    const sender = provider.getSigner(3);
    const tokenERC223Factory = new ContractFactory(tokenERC223Abi, tokenERC223Bytecode, sender);
    const token = await (await tokenERC223Factory.deploy()).deployed();
    const senderAddr = await sender.getAddress();
    await (await token.mint(senderAddr, 1000)).wait();
    await token['transfer(address,uint256,bytes)'](
      identity,
      amount,
      '0x0',
    );
    const balance = await token.balanceOf(identity);
    expect(balance.toNumber()).equal(amount);

    const params: Array<any> = [senderAddr, amount, '0x0'];
    const data = new Interface(tokenERC223Abi).functions['transfer(address,uint256,bytes)'].encode(params);
    await proxy.sendTransaction(data, token.address, 0, { gasLimit: 100000 })
      .then((tx: any) => tx.wait());
    expect((await token.balanceOf(identity)).toNumber()).equal(0);
    expect((await token.balanceOf(senderAddr)).toNumber()).equal(1000);
  });

  describe('ERC1155Multiproxy', () => {
    it('proxy owner can be changed', async () => {
      const receiver = await provider.getSigner(3).getAddress();

      expect(await proxy.owner()).equal(creatorAddr);

      await proxy.changeOwner(receiver);

      expect(await proxy.owner()).equal(receiver);
    });

    // it('burning should cease ownership of the proxy', async () => {
    //   await erc1155.burn(creatorAddr, serial);
    //   expect(parseInt(await erc1155.balanceOf(creatorAddr, serial), 16)).equal(0);
    //   expect(await proxy.owner()).equal('0x0000000000000000000000000000000000000000');
    // });

    // it('batch burning should cease ownership of the burnded proxies', async () => {
    //   const serial2 = '1234';
    //   const proxy2 = await (await proxyFactory.deploy(erc1056.address, erc1155.address, serial2, creatorAddr)).deployed();

    //   await erc1155.burn(creatorAddr, serial);
    //   await erc1155.burn(creatorAddr, serial2);

    //   expect(parseInt(await erc1155.balanceOf(creatorAddr, serial), 16)).equal(0);
    //   expect(await proxy.owner()).equal('0x0000000000000000000000000000000000000000');

    //   expect(parseInt(await erc1155.balanceOf(creatorAddr, serial2), 16)).equal(0);
    //   expect(await proxy2.owner()).equal('0x0000000000000000000000000000000000000000');
    // });
  });
});
