import { IDID } from '@ew-did-registry/did';
import { IDIDDocument } from '@ew-did-registry/did-document';
import { IClaims } from '@ew-did-registry/claims';
import { IKeyPair } from '@ew-did-registry/keys';

export interface IDIDRegistry {
    did: IDID;
    didDocument: IDIDDocument;
    claims: IClaims;
    keys: IKeyPair;

    addProvider(provider: string): void;
}
