import { ContractFactory, ethers, Wallet } from 'ethers';
import Web3 from 'web3';
import { defaultResolverSettings, ethrReg } from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did';

const GANACHE_PORT = 8544;
const web3 = new Web3(`http://localhost:${GANACHE_PORT}`);

export const getSettings = async (fillAccounts) => {
  const accounts = await web3.eth.getAccounts();

  await Promise.all(fillAccounts.map((acc) => web3.eth.sendTransaction({
    from: accounts[2],
    to: acc,
    value: '1000000000000000000',
  })));

  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const registryFactory = new ContractFactory(ethrReg.abi, ethrReg.bytecode,
    new Wallet('0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b', provider));
  const registry = await registryFactory.deploy();
  // @TODO: deploy proxy factory
  const resolverSetting = {
    abi: defaultResolverSettings.abi,
    provider: defaultResolverSettings.provider,
    address: registry.address,
    method: Methods.Erc1056,
  };

  return resolverSetting;
};
