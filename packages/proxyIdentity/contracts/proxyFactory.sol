pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import { ProxyIdentity } from "./proxyIdentity.sol";

contract ProxyFactory {
  address erc1056;
  address erc1155;
  Proxy[] proxies;
  event ProxyCreated(address proxy);

  struct Proxy {
    address payable itsAddress;
    address creator;
    address owner;
    address[] agents;
    string serial;
  }

  constructor(address _erc1056, address _erc1155) public {
    erc1056 = _erc1056;
    erc1155 = _erc1155;
  }

  function create(string memory serial) public {
    ProxyIdentity proxy = new ProxyIdentity(
      erc1056,
      erc1155,
      serial,
      msg.sender
    );
    address[] memory agents = new address[](1);
    agents[0] = msg.sender;
    proxies.push(Proxy(address(proxy), msg.sender, msg.sender, agents, serial));
    emit ProxyCreated(address(proxy));
  }

  function createBatch(string[] memory serials) public {
    for (uint256 i = 0; i < serials.length; i++) {
      create(serials[i]);
    }
  }

  function changeOwner(string memory serial, address newOwner) public {
    Proxy memory proxy = proxyBySerial(serial);
    require(
      proxy.itsAddress != address(0),
      "changeOwner: Proxy with such serial doesnt exist"
    );
    require(
      isOwnerOrApproved(msg.sender, serial),
      "changeOwner: Sender not allowed to change ownership of this proxy"
    );
    ProxyIdentity proxyIdentity = ProxyIdentity(proxy.itsAddress);
    proxyIdentity.changeOwner(newOwner);
  }

  function changeOwnerBatch(string[] memory serials, address newOwner)
    public
    returns (bool)
  {
    for (uint256 i = 0; i < serials.length; i++) {
      changeOwner(serials[i], newOwner);
    }
  }

  function proxyBySerial(string memory serial)
    public
    view
    returns (Proxy memory)
  {
    Proxy memory proxy;
    for (uint256 i = 0; i < proxies.length; i++) {
      if (compareStr(proxies[i].serial, serial)) {
        return proxies[i];
      }
    }
    return proxy;
  }

  function proxiesBySerials(string[] memory serials)
    public
    view
    returns (Proxy[] memory)
  {
    Proxy[] memory result = new Proxy[](serials.length);
    for (uint256 i = 0; i < serials.length; i++) {
      result[i] = proxyBySerial(serials[i]);
    }
    return result;
  }

  function proxyByAddress(address proxyAddress)
    public
    view
    returns (Proxy memory)
  {
    Proxy memory proxy;
    for (uint256 i = 0; i < proxies.length; i++) {
      if (proxies[i].itsAddress == proxyAddress) {
        return proxies[i];
      }
    }
    return proxy;
  }

  function compareStr(string memory s1, string memory s2)
    public
    view
    returns (bool)
  {
    return (keccak256(abi.encodePacked((s1))) ==
      keccak256(abi.encodePacked((s2))));
  }

  function isOwnerOrApproved(address account, string memory serial)
    public
    view
    returns (bool)
  {
    Proxy memory proxy = proxyBySerial(serial);
    if (proxy.owner == account) {
      return true;
    }
    for (uint256 i = 0; i < proxy.agents.length; i++) {
      if (proxy.agents[i] == account) {
        return true;
      }
    }
    return false;
  }

  function proxyOwnerChanged(address newOwner) public {
    int256 proxyIndex = -1;
    for (uint128 i = 0; i < proxies.length; i++) {
      if (proxies[i].itsAddress == msg.sender) {
        proxyIndex = i;
        break;
      }
    }
    require(
      proxyIndex >= 0,
      "proxyOwnerChanged: Proxy not found"
    );
    proxies[uint128(proxyIndex)].owner = newOwner;
  }

  function allProxies() public view returns (Proxy[] memory) {
    return proxies;
  }
}
