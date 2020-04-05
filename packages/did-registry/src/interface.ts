import {IDID, Methods} from '@ew-did-registry/did';
import {IDIDDocumentFactory, IDIDDocumentLite} from '@ew-did-registry/did-document';
import {IClaimsFactory} from '@ew-did-registry/claims';
import {IResolver} from '@ew-did-registry/did-resolver-interface';
import {IKeys} from '@ew-did-registry/keys';

/**
 * This is responsible for registration and lifecycle management of DID
 */
export interface IDIDRegistry {
    /**
     * IDID specifies the interface for decentralised identities
     */
    did: IDID;
    /**
     * IDIDDocument exposes methods to operate with DID Documents
     */
    documentFactory: IDIDDocumentFactory;
    /**
     * IClaims exposes functionality needed to manage Private and Public claims
     */
    claims: IClaimsFactory;
    /**
     * IKeys is responsible for key management, signing, as well as verification of signature
     */
    keys: Map<Methods | string, IKeys>;
    /**
     * Resolver allows to create DID Documents for different ids
     */
    resolver: IResolver;

    changeResolver(resolver: IResolver, method: Methods | string): void;

    read(did: string): Promise<IDIDDocumentLite>;
}
