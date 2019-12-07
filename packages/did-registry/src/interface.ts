import { IDID } from '@ew-did-registry/did';
import { IDIDDocumentFactory } from '@ew-did-registry/did-document';
import { IClaims } from '@ew-did-registry/claims';
import { IKeys } from '@ew-did-registry/keys';

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
    didDocument: IDIDDocumentFactory;
    /**
     * IClaims exposes functionality needed to manage Private and Public claims
     */
    claims: IClaims;
    /**
     * IKeys is responsible for key management, signing, as well as verification of signature
     */
    keys: IKeys;

    addProvider(provider: string): void;
}
