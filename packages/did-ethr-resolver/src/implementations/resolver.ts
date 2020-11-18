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
  IServiceEndpoint,
  RegistrySettings,
  KeyTags,
  DocumentSelector,
} from '@ew-did-registry/did-resolver-interface';
import { Methods } from '@ew-did-registry/did';
import { DIDPattern, ethrReg } from '../constants';
import { fetchDataFromEvents, wrapDidDocument, query } from '../functions';

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
  readonly settings: RegistrySettings;

  /**
   * Stores the provider to connect to blockchain
   */
  protected readonly _provider: providers.Provider;

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
  constructor(provider: providers.Provider, settings: RegistrySettings) {
    this._provider = provider;
    this.settings = { abi: ethrReg.abi, method: Methods.Erc1056, ...settings };

    this._contract = new ethers.Contract(settings.address, this.settings.abi, this._provider);
  }

  /**
   * Resolve DID Document for a given did
   *
   * @example
   * ```typescript
   * import { Resolver } from '@ew-did-registry/did-resolver';
   *
   * const resolver = new Resolver(resolverSettings);
   * const didDocument = await resolver.read(did);
   * ```
   *
   * @param {string} did - entity identifier, which is associated with DID Document
   * @returns {Promise<IDIDDocument>}
   */
  private async _read(
    did: string,
    selector?: DocumentSelector,
  ): Promise<IDIDDocument> {
    const [, address] = did.match(DIDPattern);
    if (!address) {
      throw new Error('Invalid did provided');
    }

    if (this._document === undefined || this._document.owner !== address) {
      this._document = {
        owner: address,
        topBlock: new utils.BigNumber(0),
        authentication: {},
        publicKey: {},
        service: {},
        attributes: new Map(),
      };
    }
    try {
      await fetchDataFromEvents(
        did,
        this._document,
        this.settings,
        this._contract,
        this._provider,
        selector,
      );
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
    selector: DocumentSelector,
  ): Promise<IPublicKey | IServiceEndpoint | IAuthentication> {
    const doc = await this._read(did, selector);
    return query(doc, selector);
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

  async readOwnerPubKey(did: string): Promise<string> {
    return (await this.readAttribute(
      did,
      {
        publicKey: { id: `${did}#${KeyTags.OWNER}` },
      },
    ) as IPublicKey)?.publicKeyHex.slice(2);
  }

  async readFromBlock(
    did: string,
    topBlock: utils.BigNumber,
  ): Promise<IDIDDocument> {
    const [, , address] = did.split(':');
    if (this._document === undefined || this._document.owner !== address) {
      this._document = {
        owner: address,
        topBlock,
        authentication: {},
        publicKey: {},
        service: {},
        attributes: new Map(),
      };
    }
    return this.read(did);
  }

  async lastBlock(did: string): Promise<utils.BigNumber> {
    const [, , address] = did.split(':');
    return this._contract.changed(address);
  }
}

export default Resolver;
