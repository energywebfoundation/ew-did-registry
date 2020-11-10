/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-useless-constructor */
import { Signer, Contract, ContractFactory } from 'ethers';
import { Provider } from 'ethers/providers';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../build/contracts/ProxyIdentity.json';
import { abi as erc1155Abi } from '../build/contracts/ERC1155Multiproxy.json';
import { abi as proxyFactoryAbi, bytecode as proxyFactoryBytecode } from '../build/contracts/ProxyFactory.json';

interface Proxy {
  itsAddress: string;
  creator: string;
  owner: string;
  agents: string[];
  serial: string;
}

export class ProxyManager {
  private factory: Contract;

  private provider: Provider;

  constructor(
    private erc1056: string,
    private erc1155: string,
    private proxyFactory: string,
    private owner: Signer,
  ) {
    this.factory = new Contract(proxyFactory, proxyFactoryAbi, this.owner);
    this.provider = owner.provider;
  }

  async createProxy(serial: string): Promise<Contract> {
    await this.factory.create(serial);
    const proxy = await this.factory.proxyBySerial(serial);
    return new Contract(proxy.itsAddress, proxyAbi, this.owner);
  }

  async createProxyBatch(serials: string[]): Promise<Contract[]> {
    await this.factory.createBatch(serials);
    const proxies = await this.factory.proxiesBySerials(serials);
    return (proxies)
      .map((p: Proxy) => new Contract(p.itsAddress, proxyAbi, this.owner));
  }

  async changeOwner(serial: string, newOwner: string) {
    await this.factory.changeOwner(serial, newOwner);
  }

  async changeOwnerBatch(serials: string[], newOwner: string) {
    await this.factory.changeOwnerBatch(serials, newOwner);
  }

  connect(newowner: Signer): ProxyManager {
    return new ProxyManager(this.erc1056, this.erc1155, this.proxyFactory, newowner);
  }

  async allProxies(): Promise<Contract[]> {
    const proxies: Proxy[] = await this.factory.allProxies();
    return proxies.map((a) => new Contract(a.itsAddress, proxyAbi, this.owner));
  }

  async proxiesOwnedBy(account: string): Promise<Contract[]> {
    const proxies = [];
    for (const proxy of await this.factory.allProxies()) {
      if (proxy.owner === account) {
        proxies.push(new Contract(proxy.itsAddress, proxyAbi, this.owner));
      }
    }
    return proxies;
  }

  async proxiesCreatedBy(account: string): Promise<Contract[]> {
    const proxies = [];
    for (const proxy of await this.factory.allProxies()) {
      if (proxy.creator === account) {
        proxies.push(new Contract(proxy.itsAddress, proxyAbi, this.owner));
      }
    }
    return proxies;
  }

  async proxyById(serial: string): Promise<Contract> {
    for await (const proxy of await this.factory.allProxies()) {
      if (proxy.serial === serial) {
        return new Contract(proxy.itsAddress, proxyAbi, this.owner);
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
}
