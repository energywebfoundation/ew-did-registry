pragma solidity 0.5.8;

import {ProxyIdentity} from "./proxyIdentity.sol";

contract ProxyFactory {
    address erc1056;
    ProxyIdentity[] proxies;
    mapping(address => bool) identities;
    event ProxyCreated(address proxy);

    constructor(address _erc1056) public payable {
        erc1056 = _erc1056;
    }

    function create() public payable returns (address) {
        require(!identities[msg.sender], "Identity already exists");
        ProxyIdentity proxy = (new ProxyIdentity).value(msg.value)(erc1056);
        proxies.push(proxy);
        proxy.changeOwner(msg.sender);
        emit ProxyCreated(address(proxy));
        return address(proxy);
    }
}