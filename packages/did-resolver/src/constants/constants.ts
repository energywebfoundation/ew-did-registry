import { IResolverSettings, ProviderTypes } from '../models';
import { ethrReg } from './EthereumDIDRegistry';

// Address of ERC1056 smart contract on Volta
export const voltaAddress1056 = '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af';

// Various patterns to minimise errors
export const matchingPatternDidEvents = /^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/;
export const matchingPatternDid = /did:[a-z0-9]+:0x[A-Za-z0-9]{40}/;
export const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
export const delegatePubKeyIdPattern = `^did:ewc:${ethAddrPattern}#delegate-(sigAuth|veriKey)-(${ethAddrPattern})$`;
export const pubKeyIdPattern = `^did:ewc:${ethAddrPattern}#key-([A-Za-z0-9]*)(sigAuth|veriKey)`;
export const serviceIdPattern = `^did:ewc:${ethAddrPattern}#service-([A-Za-z0-9]+)-([A-Za-z0-9]+)$`;
