import { Contract, providers, utils, BigNumber } from 'ethers';
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
import { ethrReg } from '../constants';
import {
  createLogsFromEvents,
  wrapDidDocument,
  query,
  getEventsFromBlocks,
} from '../functions';
import { addressOf, compressedSecp256k1KeyLength } from '..';

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
    this._contract = new Contract(
      settings.address,
      this.settings.abi,
      this._provider
    );
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
  private async _read(did: string): Promise<IDIDDocument> {
    const identity = addressOf(did);
    const { address: contractAddress, abi } = this.settings;
    const contractInterface = new utils.Interface(JSON.stringify(abi));

    const _document = {
      owner: identity,
      topBlock: BigNumber.from(0),
      authentication: {},
      publicKey: {},
      service: {},
      attributes: new Map(),
    };
    try {
      const events = await getEventsFromBlocks(
        _document.topBlock,
        await this._contract.changed(identity),
        this._provider,
        contractInterface,
        contractAddress
      );
      const relatedEvents = events.filter(
        (event) => event.event.values.identity === identity
      );
      createLogsFromEvents(did, relatedEvents, _document);
      const document = wrapDidDocument(did, _document);
      return document;
    } catch (error) {
      if (
        error instanceof Error &&
        error.toString() ===
          'Error: Blockchain address did not interact with smart contract'
      ) {
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
    selector: DocumentSelector
  ): Promise<IPublicKey | IServiceEndpoint | IAuthentication | undefined> {
    const doc = await this._read(did);
    return query(doc, selector);
  }

  /**
   * Returns the Ethereum address of current identity owner
   *
   * @param { string } did - did of identity of interest
   * @returns Promise<string>
   */
  async identityOwner(did: string): Promise<string> {
    const id = addressOf(did);
    let owner;
    try {
      owner = await this._contract.identityOwner(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return owner;
  }

  /**
   * Performs the check if the delegate is valid for particular did
   * Return boolean
   *
   * @param { string } identityDID - did of identity of interest
   * @param { DelegateTypes } delegateType - type of delegate of interest
   * @param { delegateDID } delegateDID - did of delegate of interest
   * @returns Promise<boolean>
   */
  async validDelegate(
    identityDID: string,
    delegateType: DelegateTypes,
    delegateDID: string
  ): Promise<boolean> {
    const bytesType = formatBytes32String(delegateType);
    const identityAddress = addressOf(identityDID);
    const delegateAddress = addressOf(delegateDID);

    let valid;
    try {
      valid = await this._contract.validDelegate(
        identityAddress,
        bytesType,
        delegateAddress
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }

    return valid;
  }

  async readOwnerPubKey(did: string): Promise<string | undefined> {
    const selector = {
      publicKey: { id: `${did}#${KeyTags.OWNER}` },
    };
    const pk = await this.readAttribute(did, selector);
    const publicKeyHex = pk
      ? ((pk as IPublicKey).publicKeyHex as string)
      : undefined;
    if (!publicKeyHex) {
      return undefined;
    }
    if (
      publicKeyHex.length === compressedSecp256k1KeyLength + 2 &&
      publicKeyHex.substring(0, 2) === '0x'
    ) {
      return publicKeyHex.substring(2);
    }
    if (publicKeyHex.length === compressedSecp256k1KeyLength) {
      return publicKeyHex;
    }
    return undefined;
  }

  /**
   * Reads logs from `block` up to last change
   */
  async readFromBlock(did: string, block: BigNumber): Promise<IDIDLogData> {
    const identity = addressOf(did);
    const document = {
      owner: identity,
      topBlock: block,
      authentication: {},
      publicKey: {},
      service: {},
      attributes: new Map(),
    };
    const { address: contractAddress, abi } = this.settings;
    const contractInterface = new utils.Interface(JSON.stringify(abi));
    const events = await getEventsFromBlocks(
      document.topBlock,
      await this._contract.changed(identity),
      this._provider,
      contractInterface,
      contractAddress
    );
    const relatedEvents = events.filter(
      (event) => event.event.values.identity === identity
    );
    createLogsFromEvents(did, relatedEvents, document);

    return document;
  }

  /**
   * Reads logs of all `dids` from `block` to their last changes
   */
  async readFromBlockBatch(
    dids: string[],
    block: BigNumber
  ): Promise<{ did: string; document: IDIDLogData }[]> {
    const documents = await Promise.all(
      dids.map((did) => ({
        did,
        document: {
          owner: addressOf(did),
          topBlock: this._contract.changed(addressOf(did)),
          authentication: {},
          publicKey: {},
          service: {},
          attributes: new Map(),
        },
      }))
    );
    const topBlock = documents
      .map((document) => document.document.topBlock)
      .sort((a, b) => (a.gt(b) ? 1 : a.eq(b) ? 0 : -1))
      .pop();
    const { address: contractAddress, abi } = this.settings;
    const contractInterface = new utils.Interface(JSON.stringify(abi));
    const events = await getEventsFromBlocks(
      block,
      topBlock,
      this._provider,
      contractInterface,
      contractAddress
    );
    for (const data of documents) {
      const relatedEvents = events.filter(
        (event) => event.event.values.identity === data.document.owner
      );
      createLogsFromEvents(data.did, relatedEvents, data.document);
    }

    return documents;
  }

  async lastBlock(did: string): Promise<BigNumber> {
    const address = addressOf(did);
    return this._contract.changed(address);
  }
}

export default Resolver;
