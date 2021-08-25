import {
  ContractFactory,
  Wallet,
  providers,
  utils,
  BigNumber,
} from 'ethers';
import { ethrReg } from '../packages/did-ethr-resolver/src/constants';

const { hexlify } = utils;

const GANACHE_PORT = 8544;
const provider = new providers.JsonRpcProvider(`http://localhost:${GANACHE_PORT}`);

export const deployRegistry = async (fillAccounts: Array<string>): Promise<string> => {
  const faucet = provider.getSigner(2);

  await Promise.all(fillAccounts.map((acc) => faucet.sendTransaction({
    to: acc,
    value: hexlify(BigNumber.from('1000000000000000000')),
  })));

  const registryFactory = new ContractFactory(ethrReg.abi, ethrReg.bytecode,
    new Wallet('0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b', provider));
  const registry = await registryFactory.deploy();
  // @TODO: deploy proxy factory
  return registry.address;
};
