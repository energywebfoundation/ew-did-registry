pragma solidity 0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./IdentityManager.sol";
import "./IOfferable.sol";


contract OfferableIdentity is IOfferable, ERC165 {
  address public owner;
  address manager;
  address ethrRegistry;

  address public offeredTo;

  event TransactionSent(bytes indexed data, uint256 indexed value);

  function init(address _owner, address _ethrRegistry) external {
    require(
      manager == address(0),
      "OfferableIdentity: Identity can be initialize only once"
    );
    owner = _owner;
    manager = msg.sender;
    ethrRegistry = _ethrRegistry;
    IdentityManager(manager).identityCreated(owner);
  }

  modifier isOwner() {
    require(msg.sender == owner, "OfferableIdentity: Only owner allowed");
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

  function offer(address _offeredTo) external isOwner {
    offeredTo = _offeredTo;
    IdentityManager(manager).identityOffered(offeredTo);
  }

  function acceptOffer() external isOfferedTo {
    owner = offeredTo;
    IdentityManager(manager).identityAccepted(offeredTo);
    closeOffer();
  }

  function rejectOffer() external isOfferedTo {
    IdentityManager(manager).identityRejected(offeredTo);
    closeOffer();
  }

  function cancelOffer() external isOwner {
    IdentityManager(manager).identityOfferCanceled(offeredTo);
    closeOffer();
  }

  function closeOffer() internal {
    offeredTo = address(0);
  }

  function update(bytes memory _data, uint256 value)
    external
    isOwner
    returns (bool success)
  {
    bytes memory data = _data;
    uint256 len = data.length;
    address _ethrRegistry = ethrRegistry;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      success := call(gas(), _ethrRegistry, value, add(data, 0x20), len, 0, 0)
    }
    emit TransactionSent(_data, value);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    virtual
    view
    returns (bool)
  {
    return
      interfaceId == type(IOfferable).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
