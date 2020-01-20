import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver';
import { IDID, Networks } from '@ew-did-registry/did';
import { DIDDocumentFactory, IDIDDocumentFactory } from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsFactory } from '@ew-did-registry/claims';
import { IDIDRegistry } from './interface';

class DIDRegistry implements IDIDRegistry {
  did: IDID;

  keys: Map<Networks | string, IKeys>;

  didDocument: IDIDDocumentFactory;

  claims: IClaimsFactory;

  resolver: IResolver;

  constructor(keys: IKeys, did: string, resolver: IResolver) {
    const [, network, id] = did.split(':');
    this.keys.set(network, keys);
    this.didDocument = new DIDDocumentFactory(did);
    this.claims = new ClaimsFactory(keys, resolver);
    this.resolver = resolver;
  }

  changeResolver(resolver: IResolver, network: Networks | string) {
    const relevantKeys = this.keys.get(network);
    this.didDocument = new DIDDocumentFactory(this.dids.get(network));
    this.claims = new ClaimsFactory(relevantKeys, resolver);
  }
}

export default DIDRegistry;
