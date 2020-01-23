import { Contract } from 'ethers';
import { IResolver } from '../interface';
import { IDIDDocument, IResolverSettings, DelegateTypes } from '../models';
declare class Resolver implements IResolver {
    /**
     * Stores resolver settings, such as abi, contract address, and IProvider
     */
    protected readonly _settings: IResolverSettings;
    /**
     * Stores the provider to connect to blockchain
     */
    private readonly _providerResolver;
    /**
     * Stores the smart contract instance with read functionality available
     */
    protected _contract: Contract;
    /**
     * Caches the blockchain data for further reads
     */
    private _fetchedDocument;
    /**
     * Constructor
     *
     * Settings have to be passed to construct resolver
     * @param {IResolverSettings} settings
     */
    constructor(settings?: IResolverSettings);
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
    read(did: string): Promise<IDIDDocument>;
    /**
     * Returns the Ethereum address of current identity owner
     *
     * @param { string } did - did of identity of interest
     * @returns Promise<string>
     */
    identityOwner(did: string): Promise<string>;
    /**
     * Performs the check if the delegate is valid for particular did
     * Return boolean
     *
     * @param { string } identityDID - did of identity of interest
     * @param { DelegateTypes } delegateType - type of delegate of interest
     * @param { delegateDID } did - did of delegate of interest
     * @returns Promise<boolean>
     */
    validDelegate(identityDID: string, delegateType: DelegateTypes, delegateDID: string): Promise<boolean>;
}
export default Resolver;
