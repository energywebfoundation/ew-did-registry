import { Keys } from '@ew-did-registry/keys';
import { Wallet } from 'ethers';

export const walletPubKey = (
  { privateKey }: Wallet,
): string => new Keys({ privateKey: privateKey.slice(2) }).publicKey;
