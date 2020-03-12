import { IResolverSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { ethrReg } from './EthereumDIDRegistry';

// Address of ERC1056 smart contract on Volta
export const address1056 = '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af';

// ABI of smart contract that has the address above
export const abi1056 = ethrReg.abi;

// Our default endpoint for communication with blockchain
export const defaultProvider = {
  // uriOrInfo: 'https://volta-rpc.energyweb.org/',
  uriOrInfo: 'http://localhost:8544', // to reduce testing time,
  // uriOrInfo: 'https://volta-internal-archive.energyweb.org/',
  type: ProviderTypes.HTTP,
};

/**
 * The three above comprise the minimal settings for resolver.
 * One can adjust them to use the resolver with a different provider
 * or with a different smart contract.
 */
export const defaultResolverSettings: IResolverSettings = {
  provider: defaultProvider,
  abi: ethrReg.abi,
  address: address1056,
};

// Various patterns to minimise errors

const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
const pubKeyPattern = '0x[A-Fa-f0-9]{66}';
export const attributeNamePattern = '^did/(pub|auth|svc)/(\\w+)(/(\\w+))?(/(\\w+))?$';
export const DIDPattern = `^did:[a-z0-9]+:(${ethAddrPattern})`;
export const delegatePubKeyIdPattern = `^did:ewc:${ethAddrPattern}#delegate-(sigAuth|veriKey)-(${pubKeyPattern}|${ethAddrPattern})$`;
export const pubKeyIdPattern = `^did:ewc:${ethAddrPattern}#key-([A-Za-z0-9]+)(sigAuth|veriKey)`;
export const serviceIdPattern = `^did:ewc:${ethAddrPattern}#service-([A-Za-z0-9]+)-([A-Za-z0-9]+)$`;
