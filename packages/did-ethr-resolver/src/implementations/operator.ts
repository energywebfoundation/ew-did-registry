import { IKeys } from '@ew-did-registry/keys';
import { IResolverSettings, IOperator } from '@ew-did-registry/did-resolver-interface';
import { DefaultOperator } from './defaultOperator';
import { ProxyOperator } from './proxyOperator';

export class Operator extends DefaultOperator implements IOperator {
  constructor(keys: IKeys, settings: IResolverSettings, proxyAddress?: string) {
    super(keys, settings);
    if (proxyAddress === undefined) {
      return new DefaultOperator(keys, settings);
    }
    return new ProxyOperator(keys, settings, proxyAddress);
  }
}
