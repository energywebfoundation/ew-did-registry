import { providers, Contract } from 'ethers';
import { IResolver } from '../interface';
import { IDIDDocument, IResolverSettings, DelegateTypes, IPublicKey, IServiceEndpoint, IAuthentication } from '../models';
/**
 * To support different networks compliant with ERC1056, the user/developer simply has to provide
 * different resolver settings. The default resolver settings are provided in the 'constants' folder
 * Any settings that follow the IResolverSettings interface are valid.
 *
 * The read functionality is implemented in Resolver class. If one wants to adjust it or create her
 * own implementation (for example according to ERC725), one could use this class as a
 * starting point.
 * All the functionality supporting document resolution is stored in 'functions' folder.
 */
declare class Resolver implements IResolver {
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
    private _document;
    /**
     * Constructor
     *
     * Settings have to be passed to construct resolver
     * @param {IResolverSettings} settings
     */
    constructor(settings: IResolverSettings);
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
    private _read;
    read(did: string): Promise<IDIDDocument>;
    readAttribute(did: string, filter?: {
        [key: string]: {
            [key: string]: string;
        };
    }): Promise<IPublicKey | IServiceEndpoint | IAuthentication>;
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
