import * as proxyBuild from '../build/contracts/ProxyIdentity.json';
import * as proxyFactoryBuild from '../build/contracts/ProxyFactory.json';
import * as multiproxyBuild from '../build/contracts/ERC1155Multiproxy.json';

export * as erc1056Build from '../constants/EthereumDIDRegistry';
export { proxyBuild, proxyFactoryBuild, multiproxyBuild };
export * from './proxyFacade';
export * from './ProxyManager';
