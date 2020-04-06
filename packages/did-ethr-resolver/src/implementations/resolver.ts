import {
  Contract, ethers, providers, utils,
} from 'ethers';
import {
  DelegateTypes,
  IAuthentication,
  IDIDDocument,
  IDIDLogData,
  IPublicKey,
  IResolver,
  IResolverSettings,
  IServiceEndpoint,
  ProviderTypes,
} from '@ew-did-registry/did-resolver-interface';
import { DIDPattern } from '../constants';
import { fetchDataFromEvents, wrapDidDocument } from '../functions';

/**
 * To support different methods compliant with ERC1056, the user/developer simply has to provide
 * different resolver settings. The default resolver settings are provided in the 'constants' folder
 * Any settings that follow the IResolverSettings interface are valid.
 *
 * The read functionality is implemented in Resolver class. If one wants to adjust it or create her
 * own implementation (for example according to ERC725), one could use this class as a
 * starting point.
 * All the functionality supporting document resolution is stored in 'functions' folder.
 */
class Resolver implements IResolver {
  /**
   * Stores resolver settings, such as abi, contract address, and IProvider
   */
  readonly settings: IResolverSettings;

  /**
   * Stores the provider to connect to blockchain
   */
  protected readonly _provider: providers.BaseProvider;

  /**
   * Stores the smart contract instance with read functionality available
   */
  protected _contract: Contract;

  /**
   * Caches the blockchain data for further reads
   */
  private _document: IDIDLogData;

  /**
   * Constructor
   *
   * Settings have to be passed to construct resolver
   * @param {IResolverSettings} settings
   */
  constructor(settings: IResolverSettings) {
    this.settings = settings;
    if (settings.provider.type === ProviderTypes.HTTP) {
      this._provider = new ethers.providers.JsonRpcProvider(
        settings.provider.uriOrInfo,
        settings.provider.network,
      );
    } else if (settings.provider.type === ProviderTypes.IPC) {
      this._provider = new ethers.providers.IpcProvider(
        settings.provider.path,
        settings.provider.network,
      );
    }

    this._contract = new ethers.Contract(settings.address, settings.abi, this._provider);
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
  private async _read(
    did: string,
    filter?: { [key: string]: { [key: string]: string } },
  ): Promise<IDIDDocument | IPublicKey | IServiceEndpoint | IAuthentication> {
    const [, address] = did.match(DIDPattern);
    if (!address) {
      throw new Error('Invalid did provided');
    }

    if (this._document === undefined || this._document.owner !== did) {
      this._document = {
        owner: address,
        topBlock: new utils.BigNumber(0),
        authentication: {},
        publicKey: {},
        serviceEndpoints: {},
        attributes: new Map(),
      };
    }
    try {
      const data = await fetchDataFromEvents(
        did,
        this._document,
        this.settings,
        this._contract,
        this._provider,
        filter,
      );
      if (filter) return data;
      const document = wrapDidDocument(did, this._document);
      return document;
    } catch (error) {
      if (error.toString() === 'Error: Blockchain address did not interact with smart contract') {
        const didDocument = wrapDidDocument(did, this._document);
        return didDocument;
      }
      throw error;
    }
  }

  async read(did: string): Promise<IDIDDocument> {
    return this._read(did) as Promise<IDIDDocument>;
  }

  async readAttribute(
    did: string,
    filter?: { [key: string]: { [key: string]: string } },
  ): Promise<IPublicKey | IServiceEndpoint | IAuthentication> {
    return this._read(did, filter) as Promise<IPublicKey | IAuthentication | IServiceEndpoint>;
  }

  /**
   * Returns the Ethereum address of current identity owner
   *
   * @param { string } did - did of identity of interest
   * @returns Promise<string>
   */
  async identityOwner(did: string): Promise<string> {
    const [, , id] = did.split(':');
    let owner;
    try {
      owner = await this._contract.identityOwner(id);
    } catch (error) {
      throw new Error(error);
    }
    return owner;
  }

  /**
   * Performs the check if the delegate is valid for particular did
   * Return boolean
   *
   * @param { string } identityDID - did of identity of interest
   * @param { DelegateTypes } delegateType - type of delegate of interest
   * @param { delegateDID } did - did of delegate of interest
   * @returns Promise<boolean>
   */
  async validDelegate(
    identityDID: string,
    delegateType: DelegateTypes,
    delegateDID: string,
  ): Promise<boolean> {
    const bytesType = ethers.utils.formatBytes32String(delegateType);
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = delegateDID.split(':');

    let valid;
    try {
      valid = await this._contract.validDelegate(identityAddress, bytesType, delegateAddress);
    } catch (error) {
      throw new Error(error);
    }

    return valid;
  }
}

export default Resolver;
