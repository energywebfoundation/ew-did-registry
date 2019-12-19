import { IKeys } from '@ew-did-registry/keys';
import { IResolver, IOperator } from './interface';
import {
  IDIDDocument, IResolverSettings, ProviderTypes, Operator,
} from './models';

const add = (left: number, right: number): number => left + right;

class Resolver implements IResolver {
  protected _keys: IKeys;

  protected _settings: IResolverSettings;

  constructor(keys: IKeys, settings: IResolverSettings) {
    this._keys = keys;
    this._settings = settings;
  }

  read(did: string): Promise<IDIDDocument> {
    return undefined;
  }
}

export {
  add,
  IResolver,
  Resolver,
  IOperator,
  Operator,
  IDIDDocument,
  ProviderTypes,
};
