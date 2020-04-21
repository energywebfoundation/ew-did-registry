import { Contract } from 'ethers';
import { IKeys } from '@ew-did-registry/keys';
import { IOperator } from '@ew-did-registry/did-resolver-interface';
import { IDID, Methods } from '@ew-did-registry/did';
import { DIDDocumentFactory, IDIDDocumentFull } from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsFactory } from '@ew-did-registry/claims';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import { IDIDRegistry } from './interface';

/**
 * @class {DIDRegistry}
 */
class DIDRegistry implements IDIDRegistry {
  did: IDID;

  keys: Map<Methods | string, IKeys>;

  document: IDIDDocumentFull;

  claims: IClaimsFactory;

  jwt: IJWT;

  constructor(keys: IKeys, did: string, private operator: IOperator, public store: IDidStore) {
    const [, method] = did.split(':');
    this.keys = new Map<Methods | string, IKeys>();
    this.keys.set(method, keys);
    this.jwt = new JWT(this.keys.get(method));
    this.document = new DIDDocumentFactory(did).createFull(operator);
    this.claims = new ClaimsFactory(keys, this.document, store);
    this.operator = operator;
  }

  /**
   * Configures registry for use with another method
   *
   * @example
   * ```typescript
   * import DIDRegistry from '@ew-did-registry/did-regsitry';
   * import { Method } from '@ew-did-registry/did';
   *
   * const reg = new DIDRegistry(keys, ethDid, ethResolver);
   * reg.changeResolver(new Resolver(ewcSettings), Method.EnergyWeb);
   * ```
   * @param { IResolver } resolver
   * @param { Methods } method
   * @returns { Promise<void> }
   */
  changeOperator(operator: IOperator, method: Methods | string): void {
    const keys = this.keys.get(method);
    this.document = new DIDDocumentFactory(this.did.get(method)).createFull(operator);
    this.claims = new ClaimsFactory(keys, this.document, this.store);
    this.operator = operator;
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
  async read(did: string): Promise<IDIDDocumentFull> {
    const temporaryFactory = new DIDDocumentFactory(did);
    const didDocumentLite = temporaryFactory.createFull(this.operator, did);
    await didDocumentLite.read(did);
    return didDocumentLite;
  }

  /**
  * Creates proxy identity as smart contract
  *
  * @param proxyFactory {Contract}
  *
  * @returns {string} address of created proxy identity smart contract
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
