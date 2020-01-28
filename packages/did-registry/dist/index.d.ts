import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver';
import { IDID, Networks } from '@ew-did-registry/did';
import { IDIDDocumentFactory, IDIDDocumentLite } from '@ew-did-registry/did-document';
import { IClaimsFactory } from '@ew-did-registry/claims';
import { IDIDRegistry } from './interface';
declare class DIDRegistry implements IDIDRegistry {
    did: IDID;
    keys: Map<Networks | string, IKeys>;
    documentFactory: IDIDDocumentFactory;
    claims: IClaimsFactory;
    resolver: IResolver;
    constructor(keys: IKeys, did: string, resolver: IResolver);
    /**
     * Configures registry for use with another network
     *
     * @example
     * ```typescript
     * import DIDRegistry from '@ew-did-registry/did-regsitry';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const reg = new DIDRegistry(keys, ethDid, ethResolver);
     * reg.changeResolver(new Resolver(ewcSettings), Networks.EnergyWeb);
     * ```
     * @param { IResolver } resolver
     * @param { Networks } network
     * @returns { Promise<void> }
     */
    changeResolver(resolver: IResolver, network: Networks | string): void;
    /**
     * Returns DID document of the corresponding did
     *
     * @example
     * ```typescript
     * import DIDRegistry from '@ew-did-registry/did-registry';
     *
     * const document = await reg.read(did);
     * ```
     *
     * @param { string } did
     * @returns { Promsise<DIDDocumentLite> }
     */
    read(did: string): Promise<IDIDDocumentLite>;
}
export default DIDRegistry;
