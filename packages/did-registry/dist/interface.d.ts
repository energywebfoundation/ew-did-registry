import { IDID } from 'did';
import { IDIDDocument } from 'did-document';
import { IClaimsFactory } from 'claims';
import { IKeyPair } from 'keys';
export interface IDIDREG {
    new (keyPair: IKeyPair, provider: string): IDIDREG;
    did: IDID;
    didDocument: IDIDDocument;
    claims: IClaimsFactory;
    keys: IKeyPair;
    addProvider(provider: string): void;
}
