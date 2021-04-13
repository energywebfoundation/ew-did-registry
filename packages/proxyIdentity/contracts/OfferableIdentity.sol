pragma solidity 0.8.3;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./IdentityManager.sol";
import "./IOfferable.sol";


contract OfferableIdentity is IOfferable, ERC165 {
  address public owner;
  address manager;

  address public offeredTo;

  event TransactionSent(bytes indexed data, uint256 indexed value);

  function init(address _owner) external {
    require(
      manager == address(0),
      "OfferableIdentity: Identity can be initialize only once"
    );
    owner = _owner;
    manager = msg.sender;
    IdentityManager(manager).identityCreated(owner);
  }

  modifier isOwner() {
    require(msg.sender == owner, "OfferableIdentity: Only owner allowed");
    _;
  }
  
  modifier isManager() {
    require(msg.sender == manager, "OfferableIdentity: Only manager allowed");
    _;
  }

  modifier isOfferedTo() {
    require(offeredTo != address(0), "OfferableIdentity: Proxy is not offered");
    require(
      msg.sender == offeredTo,
      "OfferableIdentity: Proxy offered to other account"
    );
    _;
  }

  function offer(address _offeredTo) external override isOwner {
    offeredTo = _offeredTo;
    IdentityManager(manager).identityOffered(offeredTo);
  }

  function acceptOffer() external override isOfferedTo {
    owner = offeredTo;
    IdentityManager(manager).identityAccepted(offeredTo);
    closeOffer();
  }

  function rejectOffer() external override isOfferedTo {
    IdentityManager(manager).identityRejected(offeredTo);
    closeOffer();
  }

  function cancelOffer() external override isOwner {
    IdentityManager(manager).identityOfferCanceled(offeredTo);
    closeOffer();
  }

  function closeOffer() internal {
    offeredTo = address(0);
  }

  function sendTransaction(address to, bytes memory data, uint256 value)
    external
    isOwner
    override
    returns (bool success)
  {
    (success, ) = to.call{ gas: gasleft() - 5000, value: value}(data);
    require(success, "OfferableIdentity: Error calling other contract");
    emit TransactionSent(data, value);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    virtual
    view
    override
    returns (bool)
  {
    return
      interfaceId == type(IOfferable).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
