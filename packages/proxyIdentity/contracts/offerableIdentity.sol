pragma solidity 0.8.0;

import "./IdentityManager.sol";


contract OfferableIdentity {
  address public owner;
  address manager;

  address public offeredTo;

  event TransactionSent(bytes indexed data, address indexed to, uint256 indexed value);

  constructor(address _owner, address _manager) {
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

  function acceptOffer() external isOfferedTo {
    owner = offeredTo;
    IdentityManager(manager).identityAccepted(address(this), offeredTo);
    closeOffer();
  }

  function rejectOffer() external isOfferedTo {
    IdentityManager(manager).identityRejected(address(this), offeredTo);
    closeOffer();
  }
  
  function cancelOffer() external isOwner {
    closeOffer();
    
    IdentityManager(manager).identityOfferCanceled(address(this), offeredTo);
  }

  function closeOffer() internal {
    offeredTo = address(0);
  }

  function sendTransaction(bytes memory _data, address to, uint256 value)
    public
    isOwner
    returns (bool success)
  {
    bytes memory data = _data;
    uint256 len = data.length;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      success := call(gas(), to, value, add(data, 0x20), len, 0, 0)
    }
    emit TransactionSent(_data, to, value);
  }
}
