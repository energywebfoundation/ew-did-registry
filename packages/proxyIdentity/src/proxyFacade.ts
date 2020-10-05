import { Contract } from 'ethers';
import { abi as proxyAbi } from '../build/contracts/ProxyIdentity.json';

/**
  * Creates proxy identity as smart contract
  *
  * @param proxyFactory {Contract}
  *
  * @returns {string} address of created proxy identity smart contract
  */
export const createProxy = async (proxyFactory: Contract, uid: number): Promise<Contract> => {
  const tx = await proxyFactory.create(uid);
  await tx.wait();
  return new Promise<Contract>(((resolve) => {
    proxyFactory.on('ProxyCreated', (address) => {
      proxyFactory.removeAllListeners('ProxyCreated');
      resolve(new Contract(address, proxyAbi, proxyFactory.signer));
    });
  }));
};
