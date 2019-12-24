import { IResolver } from '../interface';
import { matchingPatternDid, abi1056, address1056 } from '../constants';
import { fetchDataFromEvents, wrapDidDocument } from '../functions';
import {
  ProviderTypes, IResolverSettings, IDIDDocument, IDIDLogData,
} from '../models';

const defaultProvider = {
  uriOrInfo: 'http://volta-rpc.energyweb.org/',
  type: ProviderTypes.HTTP,
};

const defaultResolverSettings = {
  provider: defaultProvider,
  abi: abi1056,
  address: address1056,
};

export class Resolver implements IResolver {
    /*
     * Stores resolver settings, such as abi, contract address, and IProvider
     */
    protected readonly _settings: IResolverSettings;

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
          const document: IDIDLogData = {
            owner: undefined,
            authentication: {},
            publicKey: {},
            serviceEndpoints: {},
            attributes: new Map(),
          };
          try {
            await fetchDataFromEvents(did, document, this._settings);
            const didDocument = wrapDidDocument(did, document);
            // console.log(didDocument);
            resolve(didDocument);
          } catch (error) {
            if (error.toString() === 'Error: Blockchain address did not interact with smart contract') {
              const didDocument = wrapDidDocument(did, document);
              resolve(didDocument);
            }
            reject(error);
          }
        },
      );
    }
}

export default Resolver;
