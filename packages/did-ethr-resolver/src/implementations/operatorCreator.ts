import { IKeys } from '@ew-did-registry/keys';
import { IResolverSettings, IOperator } from '@ew-did-registry/did-resolver-interface';
import { Operator } from './operator';
import { ProxyOperator } from './proxyOperator';
import { signerFromKeys } from '../utils';

export const createOperator = (
  keys: IKeys, settings: IResolverSettings, proxyAddress?: string,
): IOperator => {
  if (proxyAddress) {
    return new ProxyOperator(keys, settings, proxyAddress);
  }
  return new Operator(signerFromKeys(keys), settings);
};
