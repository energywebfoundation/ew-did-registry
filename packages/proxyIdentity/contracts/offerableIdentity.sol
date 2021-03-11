pragma solidity ^0.5.0;

import "./IdentityManager.sol";


contract OfferableIdentity {
  address public owner;
  string public id;
  address manager;

  address public offeredTo;

  constructor(string memory _id, address _owner, address _manager) public {
    id = _id;
    owner = _owner;
    manager = _manager;
    IdentityManager(manager).identityCreated(address(this), owner);
  }

  modifier isOwner() {
    require(msg.sender == owner, "Only owner allowed");
    _;
  }

  modifier isOfferedTo() {
    require(offeredTo != address(0), "Proxy is not offered");
    require(msg.sender == offeredTo, "Proxy offered to other account");
    _;
  }

  function offer(address _offeredTo) external isOwner {
    offeredTo = _offeredTo;
    IdentityManager(manager).identityOffered(address(this), offeredTo);
  }

  function accept() external isOfferedTo {
    owner = offeredTo;
    IdentityManager(manager).identityAccepted(address(this), offeredTo);
    closeOffer();
  }

  function reject() external isOfferedTo {
    IdentityManager(manager).identityRejected(address(this), offeredTo);
    closeOffer();
  }

  function closeOffer() internal {
    offeredTo = address(0);
  }
}
