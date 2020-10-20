pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

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

    function create(string memory serial) public returns (address) {
        ProxyIdentity proxy = new ProxyIdentity(erc1056, erc1155, serial, msg.sender);
        proxies.push(proxy);
        emit ProxyCreated(address(proxy));
        return address(proxy);
    }
    
    function createBatch(string[] memory serials) public returns (address[] memory) {
      address[] memory newProxies = new address[](serials.length);
      for (uint256 i = 0; i < serials.length; i++) {
        ProxyIdentity proxy = new ProxyIdentity(erc1056, erc1155, serials[i], msg.sender);
        proxies.push(proxy);
        newProxies[i] = address(proxy);
      }
        emit BatchProxyCreated(newProxies);
        return newProxies;
    }
}
