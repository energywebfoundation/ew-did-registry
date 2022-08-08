import { IKeys, Keys } from '@ew-did-registry/keys';
import {
  IOperator,
  KeyTags,
  Encoding,
  ProviderSettings,
} from '@ew-did-registry/did-resolver-interface';
import { IDID, Methods, DID } from '@ew-did-registry/did';
import {
  DIDDocumentFactory,
  IDIDDocumentFull,
} from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsFactory } from '@ew-did-registry/claims';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import { IDIDRegistry } from './interface';

/**
 * @class {DIDRegistry}
 */
class DIDRegistry implements IDIDRegistry {
  did: IDID = new DID();

  keyStore: Map<string, IKeys>;

  document: IDIDDocumentFull;

  claims: IClaimsFactory;

  providerSettings: ProviderSettings;

  jwt: IJWT;

  constructor(
    keys: IKeys,
    did: string,
    private operator: IOperator,
    public store: IDidStore,
    _providerSettings: ProviderSettings
  ) {
    const [, method] = did.split(':');
    this.did.set(did);

    if (!Object.values(Methods).includes(method as Methods)) {
      throw new Error('Unknown Method!');
    }

    this.keyStore = new Map<string, IKeys>();
    this.keyStore.set(KeyTags.OWNER, keys);

    this.jwt = new JWT(keys);
    this.document = new DIDDocumentFactory(did).createFull(operator);
    this.claims = new ClaimsFactory(
      keys,
      this.document,
      store,
      _providerSettings
    );
    this.operator = operator;
    this.providerSettings = _providerSettings;
  }

  /**
   * Configures registry for use with another method
   *
   * @example
   * ```typescript
   * import DIDRegistry from '@ew-did-registry/did-regsitry';
   * import { Method } from '@ew-did-registry/did';
   *
   * const providerSettings = {
   *  type: ProviderTypes.HTTP,
   *  uriOrInfo: https://volta-rpc.energyweb.org,
   * }
   * const reg = new DIDRegistry(keys, ethDid, ethResolver, didStore, providerSettings);
   * reg.changeResolver(new Resolver(ewcSettings, providerUrl), Method.EnergyWeb);
   * ```
   * @param { IResolver } resolver
   * @param { Methods } method
   * @returns { Promise<void> }
   */
  changeOperator(operator: IOperator, method: Methods | string): void {
    const keys = this.keyStore.get(KeyTags.OWNER);
    if (!keys) {
      return;
    }
    const did = this.did.get(method);
    if (!did) {
      return;
    }
    this.document = new DIDDocumentFactory(did).createFull(operator);
    this.claims = new ClaimsFactory(
      keys,
      this.document,
      this.store,
      this.providerSettings
    );
    this.operator = operator;
  }

  /**
   *
   * Update keyStore from user's didDocument
   */
  async updateKeyStore(): Promise<boolean> {
    const doc = await this.document.read();

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in doc.publicKey) {
      const pubKey = doc.publicKey[key];
      const publicKeyTag = pubKey.id.split('#')[1];

      const encoding = Object.values(Encoding).find((e) => {
        const suffix = `${e[0].toUpperCase()}${e.slice(1)}`;
        return pubKey[`publicKey${suffix}`];
      });

      if (!encoding) {
        throw new Error('Unknown encoding');
      }
      const value = pubKey[
        `publicKey${encoding[0].toUpperCase()}${encoding.slice(1)}`
      ] as string;

      this.keyStore.set(publicKeyTag, new Keys({ publicKey: value.slice(2) }));
    }
    return true;
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
}

export default DIDRegistry;
