import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver';
import { IDID, Networks } from '@ew-did-registry/did';
import { DIDDocumentFactory, IDIDDocumentFactory } from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsFactory } from '@ew-did-registry/claims';
import { IDIDRegistry } from './interface';

class DIDRegistry implements IDIDRegistry {
  did: IDID;

  keys: Map<Networks | string, IKeys> = new Map();

  documentFactory: IDIDDocumentFactory;

  claims: IClaimsFactory;

  resolver: IResolver;

  constructor(keys: IKeys, did: string, resolver: IResolver) {
    const [, network, id] = did.split(':');
    this.keys.set(network, keys);
    this.documentFactory = new DIDDocumentFactory(did);
    this.claims = new ClaimsFactory(keys, resolver);
    this.resolver = resolver;
  }

  changeResolver(resolver: IResolver, network: Networks | string) {
    const relevantKeys = this.keys.get(network);
    this.documentFactory = new DIDDocumentFactory(this.did.get(network));
    this.claims = new ClaimsFactory(relevantKeys, resolver);
    this.resolver = resolver;
  }
}

export default DIDRegistry;
