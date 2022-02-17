import { Methods, Chain } from '../models';

export const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
export const DIDPattern = `^did:${Methods.Erc1056}:([A-Za-z0-9]+:)?(${ethAddrPattern})$`;
export const DIDPatternMainnet = `^did:${Methods.Erc1056}:(${ethAddrPattern})$`;
export const DIDPatternEWC = `^did:${Methods.Erc1056}:${Chain.EWC}:(${ethAddrPattern})$`;
export const DIDPatternVOLTA = `^did:${Methods.Erc1056}:${Chain.VOLTA}:(${ethAddrPattern})$`;

export function isValidErc1056(did: string): boolean {
  return new RegExp(DIDPattern).test(did);
}

export function isValidErc1056Mainnet(did: string): boolean {
  return new RegExp(DIDPatternMainnet).test(did);
}

export function isValidErc1056EWC(did: string): boolean {
  return new RegExp(DIDPatternEWC).test(did);
}

export function isValidErc1056VOLTA(did: string): boolean {
  return new RegExp(DIDPatternVOLTA).test(did);
}
