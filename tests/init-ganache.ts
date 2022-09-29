import { ContractFactory, providers, utils, Wallet } from 'ethers';
import { ethrReg } from '../packages/did-ethr-resolver/src/constants';
import {
  abi as CredentialRevocationRegistryAbi,
  bytecode as CredentialRevocationRegistryByteCode,
} from '../packages/revocation/build/contracts/CredentialRevocationRegistry.json';

const { parseEther } = utils;

const GANACHE_PORT = 8544;
const provider = new providers.JsonRpcProvider(
  `http://localhost:${GANACHE_PORT}`
);
const faucet = provider.getSigner(0);

export const deployRegistry = async (
  fillAccounts: Array<string>
): Promise<string> => {
  const deployer = Wallet.createRandom().connect(provider);
  await replenish([...fillAccounts, deployer.address]);

  const registryFactory = new ContractFactory(
    ethrReg.abi,
    ethrReg.bytecode,
    deployer
  );
  const registry = await registryFactory.deploy();
  await registry.deployed();
  // @TODO: deploy proxy factory
  return registry.address;
};

export const deployRevocationRegistry = async (
  fillAccounts: string[] = []
): Promise<string> => {
  const deployer = Wallet.createRandom().connect(provider);
  await replenish([...fillAccounts, deployer.address]);

  const registryFactory = new ContractFactory(
    CredentialRevocationRegistryAbi,
    CredentialRevocationRegistryByteCode,
    deployer
  );
  const revocationRegistry = await registryFactory.deploy();
  await revocationRegistry.deployed();
  return revocationRegistry.address;
};

export async function replenish(accs: string[]) {
  for await (const acc of accs) {
    await faucet.sendTransaction({
      to: acc,
      value: parseEther('1'),
    });
  }
}

export async function createWallet() {
  const w = Wallet.createRandom().connect(provider);
  await replenish([w.address]);
  return w;
}
