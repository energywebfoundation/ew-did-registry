import { Contract } from 'ethers';
import { abi as proxyAbi } from '../build/contracts/ProxyIdentity.json';

/**
  * Creates proxy identity as smart contract,
  * sets proxy factory as creator and invoker as owner of created proxy.
  * Owner is also recovery agent and delegate
  *
  * @param proxyFactory {Contract}
  *
  * @returns {string} address of created proxy identity smart contract
  */
export const createProxy = async (proxyFactory: Contract, serial: string): Promise<Contract> => {
  const tx = await proxyFactory.create(serial);
  await tx.wait();
  return new Promise<Contract>(((resolve) => {
    proxyFactory.on('ProxyCreated', (address) => {
      proxyFactory.removeAllListeners('ProxyCreated');
      resolve(new Contract(address, proxyAbi, proxyFactory.signer));
    });
  }));
};
