import { IDIDDocument, IResolver } from '@ew-did-registry/did-resolver';
import { IDIDDocumentLite } from './interface';
declare class DIDDocumentLite implements IDIDDocumentLite {
    did: string;
    didDocument: IDIDDocument;
    protected _resolver: IResolver;
    constructor(did: string, resolver: IResolver);
    read(attribute: string, type?: string): string | object;
}
export default DIDDocumentLite;
