import { ContractFactory, providers, utils, BigNumber } from 'ethers';
import { ethrReg } from '../packages/did-ethr-resolver/src/constants';
import {
  abi as RevocationRegistryOffChainAbi,
  bytecode as RevocationRegistryOffChainByteCode,
} from '../packages/revocation/build/contracts/RevocationRegistry.json';

const { hexlify } = utils;

const GANACHE_PORT = 8544;
const provider = new providers.JsonRpcProvider(
  `http://localhost:${GANACHE_PORT}`
);
const deployer = provider.getSigner(2);

export const deployRegistry = async (
  fillAccounts: Array<string>
): Promise<string> => {
  const faucet = provider.getSigner(2);

  await Promise.all(
    fillAccounts.map((acc) =>
      faucet.sendTransaction({
        to: acc,
        value: hexlify(BigNumber.from('1000000000000000000')),
      })
    )
  );

  const registryFactory = new ContractFactory(
    ethrReg.abi,
    ethrReg.bytecode,
    deployer
  );
  const registry = await registryFactory.deploy();
  // @TODO: deploy proxy factory
  return registry.address;
};

export const deployRevocationRegistry = async (): Promise<string> => {
  const registryFactory = new ContractFactory(
    RevocationRegistryOffChainAbi,
    RevocationRegistryOffChainByteCode,
    deployer
  );
  const revocationRegistry = await registryFactory.deploy();
  return revocationRegistry.address;
};
