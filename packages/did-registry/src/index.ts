import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver-interface';
import { IDID, Networks } from '@ew-did-registry/did';
import { DIDDocumentFactory, IDIDDocumentFactory, IDIDDocumentLite } from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsFactory } from '@ew-did-registry/claims';
import { ContractFactory, providers } from 'ethers';
import { abi as proxyFactoryAbi, bytecode as proxyFactoryBytecode } from '../../proxyIdentity/build/contracts/ProxyFactory.json';
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

  async createProxy(did: string, deployer: providers.JsonRpcSigner, value: number) {
    const [, , address] = did.split(':');
    const proxyFactory = new ContractFactory(proxyFactoryAbi, proxyFactoryBytecode, deployer);
    console.log('Step 2');
    const proxy = await (await proxyFactory.deploy(address, { value })).deployed();
    console.log('Step 3');
    console.log(proxyFactory);
    await proxy.create({ value })
      .then((tx: any) => tx.wait());
    console.log('Step 4');
  }
}

export default DIDRegistry;
