pragma solidity ^0.5.0;

import {ProxyIdentity} from "./proxyIdentity.sol";

contract ProxyFactory {
    address erc1056;
    address erc1155;
    ProxyIdentity[] proxies;
    mapping(address => bool) identities;
    event ProxyCreated(address proxy);
    event BatchProxyCreated(address[] newProxies);

    constructor(address _erc1056, address _erc1155) public {
        erc1056 = _erc1056;
        erc1155 = _erc1155;
    }

    function create(uint256 uid) public returns (address) {
        ProxyIdentity proxy = new ProxyIdentity(erc1056, erc1155, uid, msg.sender);
        proxies.push(proxy);
        emit ProxyCreated(address(proxy));
        return address(proxy);
    }
    
    function createBatch(uint256[] memory ids) public returns (address[] memory) {
      address[] memory newProxies = new address[](ids.length);
      for (uint256 i = 0; i < ids.length; i++) {
        ProxyIdentity proxy = new ProxyIdentity(erc1056, erc1155, ids[i], msg.sender);
        proxies.push(proxy);
        newProxies[i] = address(proxy);
      }
        emit BatchProxyCreated(newProxies);
        return newProxies;
    }
}
