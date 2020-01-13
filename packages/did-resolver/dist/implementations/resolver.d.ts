import { IResolver } from '../interface';
import { IDIDDocument, IResolverSettings } from '../models';
declare class Resolver implements IResolver {
    /**
     * Stores resolver settings, such as abi, contract address, and IProvider
     */
    protected readonly _settings: IResolverSettings;
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
}
export default Resolver;
