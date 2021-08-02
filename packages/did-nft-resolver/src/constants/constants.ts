import { ProviderTypes } from '@fl-did-registry/did-resolver-interface';
import { ethAddrPattern } from '@fl-did-registry/did';

// Address of ERC1056 smart contract on Volta
export const VoltaAddress1056 = '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af';

export const defaultProvider = {
  uriOrInfo: 'http://localhost:8544',
  type: ProviderTypes.HTTP,
};

const pubKeyPattern = '0x[A-Fa-f0-9]{66}';
export const attributeNamePattern = '^did/(vm|auth|svc)/(\\w+)(/(\\w+))?(/(\\w+))?$';
export const delegatePubKeyIdPattern = `^did:[a-z0-9]+:${ethAddrPattern}#delegate-(sigAuth|veriKey)-(${pubKeyPattern}|${ethAddrPattern})$`;
export const pubKeyIdPattern = `^did:[a-z0-9]+:${ethAddrPattern}#key-([A-Za-z0-9]+)`;
export const serviceIdPattern = `^did:[a-z0-9]+:${ethAddrPattern}#service-([A-Za-z0-9]+)`;
