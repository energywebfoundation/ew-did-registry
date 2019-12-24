import {
  BigNumber, ConnectionInfo, Networkish, ParamType,
} from 'ethers/utils';
import { IResolver } from '../interface';
import { abi1056, address1056, matchingPatternDid } from '../constants';
// import { defaultResolverSettings, matchingPatternDid } from '../constants';
import { fetchDataFromEvents, wrapDidDocument } from '../functions';

console.log('--- importing resolver.ts');

export interface IAuthentication {
  type: string;
  publicKey: string;
  validity?: BigNumber;
}

export interface IPublicKey {
  id: string;
  type: string;
  controller: string;
  ethereumAddress?: string;
  publicKeyBase64?: string;
  publicKeyBase58?: string;
  publicKeyHex?: string;
  publicKeyPem?: string;
  publicKeyJwk?: string;
  publicKeyMultibase?: string;
  validity?: BigNumber;
  [key: string]: string|BigNumber;
}

export interface IServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
  description?: string;
  validity?: BigNumber;
}

export enum ProviderTypes {
  HTTP,
  IPC,
}

export interface IProvider {
  type: ProviderTypes;
  uriOrInfo?: string | ConnectionInfo;
  path?: string;
  network?: Networkish;
}

export interface IResolverSettings {
  provider?: IProvider;
  abi?: Array<string | ParamType>;
  address?: string;
}

export interface IDIDDocument {
  '@context': string;
  id: string;
  publicKey: IPublicKey[];
  authentication: Array<IAuthentication | string>;
  delegates?: string[];
  service?: IServiceEndpoint[];
  created?: string;
  updated?: string;
  proof?: ILinkedDataProof;
}

export interface ILinkedDataProof {
  type: string;
  created: string;
  creator: string;
  signatureValue: string;
}

export interface ISmartContractEvent {
  name: string;
  signature: string;
  topic: string;
  values: {
    identity: string;
    delegateType: string;
    delegate: string;
    validTo: BigNumber;
    previousChange: object;
    name?: string;
    value?: string;
  };
  value?: string;
}

export interface IDIDLogData {
  owner: string;
  publicKey: { [key: string]: IPublicKey };
  authentication: { [key: string]: IAuthentication };
  delegates?: string[];
  serviceEndpoints?: { [key: string]: IServiceEndpoint };
  created?: string;
  updated?: string;
  proof?: ILinkedDataProof;
  attributes?: Map<string, { [key: string]: string | object}>;
}

export interface IHandlers {
  [key: string]: (event: ISmartContractEvent,
                  etherAddress: string,
                  document: IDIDLogData,
                  validTo: BigNumber) => IDIDLogData;
}

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

console.log('--- imported resolver.ts');

// export default Resolver;
