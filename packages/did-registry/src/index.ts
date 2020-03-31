import { Contract } from 'ethers';
import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver-interface';
import { IDID, Networks } from '@ew-did-registry/did';
import { DIDDocumentFactory, IDIDDocumentFactory, IDIDDocumentLite } from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsFactory } from '@ew-did-registry/claims';
import { IDIDRegistry } from './interface';

class DIDRegistry implements IDIDRegistry {
  did: IDID;

  keys: Map<Networks | string, IKeys>;

  documentFactory: IDIDDocumentFactory;

  claims: IClaimsFactory;

  resolver: IResolver;

  constructor(keys: IKeys, did: string, resolver: IResolver) {
    const [, network] = did.split(':');
    this.keys = new Map<Networks | string, IKeys>();
    this.keys.set(network, keys);
    this.documentFactory = new DIDDocumentFactory(did);
    this.claims = new ClaimsFactory(keys, resolver);
    this.resolver = resolver;
  }

  /**
   * Configures registry for use with another network
   *
   * @example
   * ```typescript
   * import DIDRegistry from '@ew-did-registry/did-regsitry';
   * import { Networks } from '@ew-did-registry/did';
   *
   * const reg = new DIDRegistry(keys, ethDid, ethResolver);
   * reg.changeResolver(new Resolver(ewcSettings), Networks.EnergyWeb);
   * ```
   * @param { IResolver } resolver
   * @param { Networks } network
   * @returns { Promise<void> }
   */
  changeResolver(resolver: IResolver, network: Networks | string): void {
    const relevantKeys = this.keys.get(network);
    this.documentFactory = new DIDDocumentFactory(this.did.get(network));
    this.claims = new ClaimsFactory(relevantKeys, resolver);
    this.resolver = resolver;
  }

  /**
   * Returns DID document of the corresponding did
   *
   * @example
   * ```typescript
   * import DIDRegistry from '@ew-did-registry/did-registry';
   *
   * const document = await reg.read(did);
   * ```
   *
   * @param { string } did
   * @returns { Promsise<DIDDocumentLite> }
   */
  async read(did: string): Promise<IDIDDocumentLite> {
    const temporaryFactory = new DIDDocumentFactory(did);
    const didDocumentLite = temporaryFactory.createLite(this.resolver, did);
    await didDocumentLite.read(did);
    return didDocumentLite;
  }


  /**
     * Creates a Proxy Identity
     *
     * @example
     * ```typescript
     * import DIDRegistry from '@ew-did-registry/did-registry';
     *
     * const proxy = await DiDRegistry.createProxy();
     * ```
     *
     * @param { string } contractAddress
     * @param { JsonRpcSigner } deployer
     * @param { number } value
     * @returns { Promsise<string> }
     */

  static async createProxy(proxyFactory: Contract): Promise<string> {
    const tx = await proxyFactory.create();
    await tx.wait();
    return new Promise<string>(((resolve) => {
      proxyFactory.on('ProxyCreated', (proxy) => {
        proxyFactory.removeAllListeners('ProxyCreated');
        resolve(proxy);
      });
    }));
  }
}

export default DIDRegistry;
