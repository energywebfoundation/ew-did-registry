import { Methods } from '../models';

export const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
export const DIDPattern = `^did:${Methods.Erc1056}:(${ethAddrPattern})$`;

export function isValidErc1056(did: string): boolean {
  return new RegExp(DIDPattern).test(did);
}
