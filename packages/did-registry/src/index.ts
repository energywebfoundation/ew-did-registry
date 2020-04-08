import { Contract } from 'ethers';
import crypto from 'crypto';
import { IKeys } from '@ew-did-registry/keys';
import { IOperator, DIDAttribute, PubKeyType } from '@ew-did-registry/did-resolver-interface';
import { IDID, Networks } from '@ew-did-registry/did';
import { DIDDocumentFactory, IDIDDocumentLite, IDIDDocumentFull } from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsFactory, ISaltedFields } from '@ew-did-registry/claims';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import { IDIDRegistry } from './interface';
import { IJWT, JWT } from '../../jwt/dist';

/**
 * @class {DIDRegistry}
 */
class DIDRegistry implements IDIDRegistry {
  did: IDID;

  keys: Map<Networks | string, IKeys>;

  document: IDIDDocumentFull;

  claims: IClaimsFactory;

  jwt: IJWT;

  constructor(keys: IKeys, did: string, private operator: IOperator, public store: IDidStore) {
    const [, network] = did.split(':');
    this.keys = new Map<Networks | string, IKeys>();
    this.keys.set(network, keys);
    this.jwt = new JWT(this.keys.get(network));
    this.document = new DIDDocumentFactory(did).createFull(operator);
    this.claims = new ClaimsFactory(keys, operator);
    this.operator = operator;
  }

  /**
   * Verifies content of the issued claim, issuer identity and add claim to service endpoints
   *
   * @param issued {string} claim approved by the issuer
   * @param verifyData {object} user data which should be contained in issued claim
   *
   * @returns {string} url of the saved claim
   */
  async publishPublicClaim(issued: string, verifyData: object): Promise<string> {
    const verified = await this.claims.createClaimsUser().verifyPublicClaim(issued, verifyData);
    if (verified) {
      return this.addClaimToServiceEndpoints(issued);
    }
    return '';
  }

  /**
   * Verifies content of the issued claim, issuer identity and add claim to service endpoints
   *
   * @param issued {string} claim with encrypted user data approved by the issuer
   * @param saltedFields {ISaltedFields} private user data
   *
   * @returns {string} url of the saved claim
   */
  async publishPrivateClaim(issued: string, saltedFields: ISaltedFields): Promise<string> {
    const verified = await this.claims.createClaimsUser().verifyPrivateClaim(issued, saltedFields);
    if (verified) {
      return this.addClaimToServiceEndpoints(issued);
    }
    return '';
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
  changeOperator(operator: IOperator, network: Networks | string): void {
    const keys = this.keys.get(network);
    this.document = new DIDDocumentFactory(this.did.get(network)).createFull(operator);
    this.claims = new ClaimsFactory(keys, operator);
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
  async read(did: string): Promise<IDIDDocumentLite> {
    const temporaryFactory = new DIDDocumentFactory(did);
    const didDocumentLite = temporaryFactory.createLite(this.operator, did);
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

  private async addClaimToServiceEndpoints(claim: string): Promise<string> {
    const hash = crypto.createHash('sha256').update(claim).digest('hex');
    const uri = await this.store.save(claim);
    await this.document.update(
      DIDAttribute.ServicePoint,
      {
        type: PubKeyType.VerificationKey2018,
        value: JSON.stringify({ serviceEndpoint: uri, hash }),
      },
    );
    return uri;
  }
}

export default DIDRegistry;
