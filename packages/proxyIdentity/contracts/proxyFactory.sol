pragma solidity 0.5.8;

import {ProxyIdentity} from "./proxyIdentity.sol";

contract ProxyFactory {
    address erc1056;
    ProxyIdentity[] proxies;

    constructor(address _erc1056) public {
        erc1056 = _erc1056;
    }

    function create() public payable returns (ProxyIdentity proxy) {
        proxy = (new ProxyIdentity).value(msg.value)(erc1056);
        proxies.push(proxy);
        proxy.changeOwner(msg.sender);
        return proxy;
    }
}
