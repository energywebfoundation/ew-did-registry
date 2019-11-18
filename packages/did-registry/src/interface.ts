import { IDID } from '@ew-did-registry/did';
import { IDIDDocument } from '@ew-did-registry/did-document';
import { IClaims } from '@ew-did-registry/claims';
import { IKeys } from '@ew-did-registry/keys';

export interface IDIDRegistry {
    /**
     * This is responsible for registration and lifecycle management of DID
     *
     * IDID specifies the interface for decentralised identities
     * IDIDDocument exposes methods to operate with DID Documents
     * IClaims exposes functionality needed to manage Private and Public claims
     * IKeys is responsible for key management, signing, as well as verification of signature
     */
    did: IDID;
    didDocument: IDIDDocument;
    claims: IClaims;
    keys: IKeys;

    addProvider(provider: string): void;
}
