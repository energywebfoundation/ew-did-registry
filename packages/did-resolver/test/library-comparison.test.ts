/* eslint-disable no-await-in-loop */
import { ethers } from 'ethers';
import { Keys } from '@ew-did-registry/keys';
import Web3 from 'web3';
import { abi1056, address1056 } from '../src/constants';

describe.skip('[DID-RESOLVER-PERFORMANCE-COMPARISON]', function () {
  this.timeout(0);
  const voltaUri = 'https://volta-internal-archive.energyweb.org/';
  // const voltaUri = 'https://volta-rpc.energyweb.org/';
  // Create ethers wallet
  const ethersKeys = new Keys({
    privateKey: '6474406a8130ec4f9ad5bebb2361bad3e4fe192152b5d6b5de4722f4aea86126',
    publicKey: '02363dfb0b3280ae4d493ed23ae5250bab3f6d59a62c0219565e425545cf6cc2b7',
  });
  const web3Keys = new Keys({
    privateKey: 'e5bd91d9b4c0b7a2947761e2bd661f1b20137eb7a726a4a622810eebaac0ae7d',
    publicKey: '0343f7f97553b02829486f8e306cb02a72147867108f2edbc8b44311ebd1885e3f',
  });
  const ethersProvider = new ethers.providers.JsonRpcProvider(voltaUri);
  const faucet = new ethers.Wallet(ethersKeys.privateKey, ethersProvider);
  const userKeys = new Keys();
  const web3 = new Web3(voltaUri);

  it('Compare transfer ethers', async () => {
    const n = 10;
    /* --------------- Test web3 -----------------*/
    let nonce = await web3.eth.getTransactionCount(web3Keys.getAddress());
    console.time('Use web3');
    for (let i = 0; i < n; i++) {
      // console.log('web3 contract nonce=', nonce);
      // eslint-disable-next-line no-await-in-loop
      const txWeb3 = await web3.eth.accounts.signTransaction(
        {
          nonce,
          to: userKeys.getAddress(),
          value: 1000,
          from: web3Keys.getAddress(),
          gas: '210000',
        },
        web3Keys.privateKey,
      );
      nonce += 1;
      const txSendWeb3 = web3.eth.sendSignedTransaction(txWeb3.rawTransaction);
      // .once('receipt', () => { console.timeLog('Use web3', 'Web3 tx receipt'); })
      // .once('confirmation', () => { console.timeLog('Use web3', 'Web3 tx confirmed'); });
      await txSendWeb3;
    }
    console.timeEnd('Use web3');

    /* ----------------- Test ethers ----------------*/
    nonce = await ethersProvider.getTransactionCount(ethersKeys.getAddress());
    console.time('Use ethers');
    for (let i = 0; i < n; i++) {
      const txEthers = await faucet.sendTransaction({
        to: userKeys.getAddress(),
        value: ethers.utils.parseEther('0.0001'),
        gasLimit: 210000,
        nonce,
      });
      await txEthers.wait();
      nonce += 1;
    }
    console.timeEnd('Use ethers');
  });

  it('Compare update ERC1056 attribute', async () => {
    const identity = '0x37155f6d56b3be462bbd6b154c5E960D19827167';
    const name = ethers.utils.formatBytes32String('name');
    const value = `0x${Buffer.from('John').toString('hex')}`;
    const validity = 60 * 1000;
    /* ------------ Test ethers ---------------- */
    console.time('Use ethers');
    const ethContract = new ethers.Contract(address1056, abi1056, faucet);
    try {
      const tx = await ethContract.setAttribute(identity, name, value, validity, { gasLimit: 210000 });
      // console.log('ethers tx: ', tx);
      await tx.wait();
    } catch (e) {
      console.log('Error invoking contract:', e);
    }
    console.timeEnd('Use ethers');
    /* ------------ Test web3 ------------------ */
    console.time('Use web3');
    const web3Contract = new web3.eth.Contract(abi1056 as any, address1056);
    await web3Contract.methods.setAttribute(identity, name, value, validity).send({
      from: faucet.address,
      gas: 210000,
    });
    console.timeEnd('Use web3');
  });
});
