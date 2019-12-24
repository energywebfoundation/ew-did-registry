import { BigNumber } from 'ethers/utils';

import { IResolver } from '../interface';
import { IDIDDocument, IDIDLogData, IResolverSettings } from './index';
import { defaultResolverSettings, matchingPatternDid } from '../constants';
import { fetchDataFromEvents, wrapDidDocument } from '../functions';

class Resolver implements IResolver {
    /*
     * Stores resolver settings, such as abi, contract address, and IProvider
     */
    protected readonly _settings: IResolverSettings;

    /*
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

    async read(did: string): Promise<IDIDDocument> {
      return new Promise(
        // eslint-disable-next-line no-async-promise-executor
        async (resolve, reject) => {
          if (!matchingPatternDid.test(did)) {
            reject(new Error('Invalid did provided'));
            return;
          }

          if (this._fetchedDocument === undefined) {
            this._fetchedDocument = {
              owner: undefined,
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
