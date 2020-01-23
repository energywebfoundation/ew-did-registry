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
    changeResolver(resolver: IResolver, network: Networks | string): void;
    read(did: string): Promise<IDIDDocumentLite>;
}
export default DIDRegistry;
