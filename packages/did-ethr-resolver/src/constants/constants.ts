import { ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { ethAddrPattern } from '@ew-did-registry/did';

// Address of ERC1056 smart contract on Volta
export const VoltaAddress1056 = '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af';

export const defaultProvider = {
  uriOrInfo: 'http://localhost:8544',
  type: ProviderTypes.HTTP,
};

const pubKeyPattern = '0x[A-Fa-f0-9]{66}';
export const attributeNamePattern =
  '^did/(pub|auth|svc)/(\\w+)(/(\\w+))?(/(\\w+))?$';
export const didPattern = `did:[a-z0-9]+?(:[a-z0-9]+)?:${ethAddrPattern}`;
export const delegatePubKeyIdPattern = `^${didPattern}#delegate-(sigAuth|veriKey)-(${pubKeyPattern}|${ethAddrPattern})$`;
export const pubKeyIdPattern = `^${didPattern}#key-([A-Za-z0-9]+)`;
export const serviceIdPattern = `^${didPattern}#service-([A-Za-z0-9]+)`;
