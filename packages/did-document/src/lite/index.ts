import {
  IDIDDocument, IResolver, DelegateTypes, IPublicKey, IServiceEndpoint, IAuthentication,
} from '@ew-did-registry/did-resolver-interface';
import { IDIDDocumentLite } from './interface';

class DIDDocumentLite implements IDIDDocumentLite {
  /**
* @param {string} did
* @param {Resolver} resolver
*/
  // eslint-disable-next-line no-useless-constructor
  constructor(public did: string, private resolver: IResolver) { }

  identityOwner(did = this.did): Promise<string> {
    return this.resolver.identityOwner(did);
  }

  validDelegate(
    delegateType: DelegateTypes, delegateDID: string, did = this.did,
  ): Promise<boolean> {
    return this.resolver.validDelegate(did, delegateType, delegateDID);
  }

  readAttribute(
    filter: { [key: string]: { [key: string]: string } }, did = this.did,
  ): Promise<IPublicKey | IServiceEndpoint | IAuthentication> {
    return this.resolver.readAttribute(did, filter);
  }

  async read(did = this.did): Promise<IDIDDocument> {
    return this.resolver.read(did);
  }
}

export { IDIDDocumentLite, DIDDocumentLite };
