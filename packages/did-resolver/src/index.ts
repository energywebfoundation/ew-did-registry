import { IKeys } from '@ew-did-registry/keys';
import { IResolver, IOperator } from './interface';
import { IDIDDocument, IDIDLogData, IResolverSettings } from './models';
import { defaultResolverSettings, matchingPatternDid, matchingPatternDidEvents } from './constants';
import { fetchDataFromEvents, wrapDidDocument } from './functions';

const add = (left: number, right: number): number => left + right;

class Resolver implements IResolver {
  /*
   * Stores the public key from key pair to form default did
   */
  private readonly _keys: IKeys;

  /*
   * Stores resolver settings, such as abi, contract address, and IProvider
   */
  private readonly _settings: IResolverSettings;

  /**
   * Key pair has to be passed on construction to JWT
   * @param {Keys} keys
   */
  constructor(keys: IKeys, settings: IResolverSettings = defaultResolverSettings) {
    this._keys = keys;
    this._settings = settings;
  }

  async read(did: string): Promise<IDIDDocument> {
    return new Promise(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        const match = did.match(matchingPatternDidEvents);
        const id = match[2];
        const document: IDIDLogData = {
          owner: undefined,
          authentication: {},
          publicKey: {},
          serviceEndpoints: {},
          attributes: new Map(),
        };
        try {
          await fetchDataFromEvents(id, document, this._settings);
          const didDocument = wrapDidDocument(id, document);
          resolve(didDocument);
        } catch (error) {
          reject(error);
        }
      },
    );
  }
}

export {
  add,
  IResolver,
  IOperator,
  IDIDDocument,
};
