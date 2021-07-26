import {
  Contract, providers, utils, BigNumber,
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
import { Methods, DIDPattern } from '@ew-did-registry/did';
import ethrReg from '../constants/EthereumDIDRegistry.json';
import { fetchDataFromEvents, wrapDidDocument, query } from '../functions';

const { formatBytes32String } = utils;

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
  readonly settings: Required<RegistrySettings>;

  /**
   * Stores the provider to connect to blockchain
   */
  protected readonly _provider: providers.Provider;

  /**
   * Stores the smart contract instance with read functionality available
   */
  protected _contract: Contract;

  /**
   * Constructor
   *
   * @param settings - Settings to connect to Ethr registry
   * @param provider - Ethers provider. Can be obtained from getProvider(providerSettings)
   */

  constructor(provider: providers.Provider, settings: RegistrySettings) {
    this._provider = provider;
    this.settings = { abi: ethrReg.abi, method: Methods.Erc1056, ...settings };
    this._contract = new Contract(settings.address, this.settings.abi, this._provider);
  }

  /**
   * Resolve DID Document for a given did
   *
   * @example
   * ```typescript
   * import { Resolver } from '@ew-did-registry/did-resolver';
   *
   * const resolver = new Resolver(provider, resolverSettings);
   * const didDocument = await resolver.read(did);
   * ```
   *
   * @param did - entity identifier, which is associated with DID Document
   * @returns {Promise<IDIDDocument>}
   */
  private async _read(
    did: string,
    selector?: DocumentSelector,
  ): Promise<IDIDDocument> {
    const match = did.match(DIDPattern);
    if (!match) {
      throw new Error('Invalid did provided');
    }
    const address = match[1];

    const _document = {
      owner: address,
      topBlock: BigNumber.from(0),
      authentication: {},
      publicKey: {},
      service: {},
      attributes: new Map(),
    };
    try {
      await fetchDataFromEvents(
        did,
        _document,
        this.settings,
        this._contract,
        this._provider,
        selector,
      );
      const document = wrapDidDocument(did, _document);
      return document;
    } catch (error) {
      if (error.toString() === 'Error: Blockchain address did not interact with smart contract') {
        const didDocument = wrapDidDocument(did, _document);
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
  ): Promise<IPublicKey | IServiceEndpoint | IAuthentication | undefined> {
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
    const bytesType = formatBytes32String(delegateType);
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

  async readOwnerPubKey(did: string): Promise<string | undefined> {
    const selector = {
      publicKey: { id: `${did}#${KeyTags.OWNER}` },
    };
    const pk = await this.readAttribute(
      did,
      selector,
    );
    return pk ? ((pk as IPublicKey).publicKeyHex as string) : undefined;
  }

  async readFromBlock(
    did: string,
    topBlock: BigNumber,
  ): Promise<IDIDLogData> {
    const [, , address] = did.split(':');
    const _document = {
      owner: address,
      topBlock,
      authentication: {},
      publicKey: {},
      service: {},
      attributes: new Map(),
    };
    await fetchDataFromEvents(did, _document, this.settings, this._contract, this._provider);
    return { ..._document };
  }

  async lastBlock(did: string): Promise<BigNumber> {
    const [, , address] = did.split(':');
    return this._contract.changed(address);
  }
}

export default Resolver;
