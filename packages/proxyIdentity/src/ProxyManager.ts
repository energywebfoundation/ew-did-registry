/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-useless-constructor */
import {
  Signer, Contract, ContractFactory, providers,
} from 'ethers';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../build/contracts/ProxyIdentity.json';
import { abi as erc1155Abi } from '../build/contracts/ERC1155Multiproxy.json';

export class ProxyManager {
  private proxyFactory: ContractFactory;

  private provider: providers.Provider;

  constructor(private erc1056: string, private erc1155: string, private owner: Signer) {
    this.proxyFactory = new ContractFactory(proxyAbi, proxyBytecode, this.owner);
    this.provider = owner.provider;
  }

  async createProxy(serial: string): Promise<Contract> {
    const address = await this.proxyFactory.signer.getAddress();
    return this.proxyFactory.deploy(
      this.erc1056, this.erc1155, serial, await this.owner.getAddress(),
      { nonce: await this.provider.getTransactionCount(address) },
    );
  }

  async createProxyBatch(serials: string[]): Promise<Contract[]> {
    const proxies = [];
    for await (const serial of serials) {
      proxies.push(await this.createProxy(serial));
    }
    return proxies;
  }

  async changeOwner(serial: string, newOwner: string) {
    const proxies = await this._allProxies();
    for await (const proxy of proxies) {
      if (await proxy.serial() === serial) {
        await proxy.changeOwner(newOwner);
        return;
      }
    }
  }

  async changeOwnerBatch(serials: string[], newOwner: string) {
    for await (const serial of serials) {
      await this.changeOwner(serial, newOwner);
    }
  }

  connect(newowner: Signer): ProxyManager {
    return new ProxyManager(this.erc1056, this.erc1155, newowner);
  }

  async allProxies(): Promise<Contract[]> {
    return this._allProxies();
  }

  async proxiesOwnedBy(address: string): Promise<Contract[]> {
    const proxies = [];
    for await (const proxy of await this._allProxies()) {
      if (await proxy.owner() === address) {
        proxies.push(proxy);
      }
    }
    return proxies;
  }

  async proxiesCreatedBy(address: string): Promise<Contract[]> {
    const proxies = [];
    for await (const proxy of await this._allProxies()) {
      if (await proxy.creator() === address) {
        proxies.push(proxy);
      }
    }
    return proxies;
  }

  async proxyById(serial: string): Promise<Contract> {
    for await (const proxy of await this._allProxies()) {
      if (await proxy.serial() === serial) {
        return proxy;
      }
    }
    return null;
  }

  static async mapProxiesBy(proxies: Contract[], fn: (proxy: Contract) => Promise<any>) {
    const mapped = [];
    for await (const proxy of proxies) {
      mapped.push(await fn(proxy));
    }
    return mapped;
  }

  private async _allProxies(): Promise<Contract[]> {
    const addresses: string[] = await new Contract(this.erc1155, erc1155Abi, this.owner).proxies();
    return addresses.map((a) => new Contract(a, proxyAbi, this.owner));
  }
}
