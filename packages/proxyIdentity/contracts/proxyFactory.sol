pragma solidity ^0.5.0;

import {ProxyIdentity} from "./proxyIdentity.sol";

contract ProxyFactory {
    address erc1056;
    address erc1155;
    ProxyIdentity[] proxies;
    mapping(address => bool) identities;
    event ProxyCreated(address proxy);

    constructor(address _erc1056, address _erc1155) public {
        erc1056 = _erc1056;
        erc1155 = _erc1155;
    }

    function create(uint256 uid) public returns (address) {
        ProxyIdentity proxy = new ProxyIdentity(erc1056, erc1155, uid);
        proxies.push(proxy);
        emit ProxyCreated(address(proxy));
        return address(proxy);
    }
}
