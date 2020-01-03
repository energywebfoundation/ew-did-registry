import { BigNumber } from 'ethers/utils';

import { IResolver } from '../interface';
import { IDIDDocument, IDIDLogData, IResolverSettings } from '../models';
import { defaultResolverSettings, matchingPatternDid } from '../constants';
import { fetchDataFromEvents, wrapDidDocument } from '../functions';

class Resolver implements IResolver {
  /**
   * Stores resolver settings, such as abi, contract address, and IProvider
   */
  protected readonly _settings: IResolverSettings;

  /**
   * Caches the blockchain data for further reads
   */
  private _fetchedDocument: IDIDLogData;

  /**
   * Constructor
   *
   * Settings have to be passed to construct resolver
   * @param {IResolverSettings} settings
   */
  constructor(settings: IResolverSettings = defaultResolverSettings) {
    this._settings = settings;
  }

  /**
   * Resolve DID Document for a given did
   *
   * @example
   * ```typescript
   * import { Resolver } from '@ew-did-registry/did-resolver';
   *
   * const resolver = new Resolver();
   * const didDocument = await resolver.read(did);
   * ```
   *
   * @param {string} did - entity identifier, which is associated with DID Document
   * @returns {Promise<IDIDDocument>}
   */
  async read(did: string): Promise<IDIDDocument> {
    return new Promise(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        if (!matchingPatternDid.test(did)) {
          reject(new Error('Invalid did provided'));
          return;
        }

        if (this._fetchedDocument === undefined) {
          const [, , blockchainAddress] = did.split(':');
          this._fetchedDocument = {
            owner: blockchainAddress,
            lastChangedBlock: new BigNumber(0),
            authentication: {},
            publicKey: {},
            serviceEndpoints: {},
            attributes: new Map(),
          };
        }
        try {
          await fetchDataFromEvents(did, this._fetchedDocument, this._settings);
          const didDocument = wrapDidDocument(did, this._fetchedDocument);
          resolve(didDocument);
        } catch (error) {
          if (error.toString() === 'Error: Blockchain address did not interact with smart contract') {
            const didDocument = wrapDidDocument(did, this._fetchedDocument);
            resolve(didDocument);
          }
          reject(error);
        }
      },
    );
  }
}

export default Resolver;
