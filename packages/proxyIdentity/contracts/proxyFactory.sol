pragma solidity ^0.5.0;

import {ProxyIdentity} from "./proxyIdentity.sol";

contract ProxyFactory {
    address erc1056;
    ProxyIdentity[] proxies;
    mapping(address => bool) identities;
    event ProxyCreated(address proxy);

    constructor(address _erc1056) public {
        erc1056 = _erc1056;
    }

    function create() public returns (address) {
        ProxyIdentity proxy = new ProxyIdentity(erc1056);
        proxies.push(proxy);
        proxy.changeOwner(msg.sender);
        emit ProxyCreated(address(proxy));
        return address(proxy);
    }
}
