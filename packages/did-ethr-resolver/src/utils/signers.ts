/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { IKeys } from '@ew-did-registry/keys';
import { ethers, Signer } from 'ethers';

export const signerFromKeys = (keys: IKeys): Signer => new ethers.Wallet(keys.privateKey);
