import {ContractFactory, ethers, Wallet} from 'ethers';
import Web3 from 'web3';
import {AsyncSendable} from 'ethers/providers';
import {ethrReg} from '../packages/did-resolver/src/constants';
import {IResolverSettings, ProviderTypes} from '../packages/did-resolver/src/models';

const GANACHE_PORT = 8544;
const web3 = new Web3(`http://localhost:${GANACHE_PORT}`);

export const getSettings = async (fillAccounts: Array<string>) => {
  const accounts = await web3.eth.getAccounts();

  await Promise.all(fillAccounts.map((acc) => web3.eth.sendTransaction({
    from: accounts[2],
    to: acc,
    value: '1000000000000000000',
  })));

  const provider = new ethers.providers.Web3Provider(web3.currentProvider as AsyncSendable);
  const registryFactory = new ContractFactory(ethrReg.abi, ethrReg.bytecode,
    new Wallet('0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b', provider));
  const registry = await registryFactory.deploy();
  const resolverSetting: IResolverSettings = {
    abi: ethrReg.abi,
    provider: {
      type: ProviderTypes.HTTP,
      uriOrInfo: `http://localhost:${GANACHE_PORT}`
    },
    address: registry.address,
  };

  return resolverSetting;
};
