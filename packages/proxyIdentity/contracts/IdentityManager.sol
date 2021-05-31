pragma solidity 0.8.3;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./OfferableIdentity.sol";
import "./IOfferable.sol";


contract IdentityManager {
  address libraryAddress;
  
  bytes4 private constant INIT_SELECTOR = bytes4(keccak256(bytes('init(address)')));
  
  struct Identity {
    bool created;
    bool verified;
    bool compliant;
    bool offered;
    address owner;
  }
  
  mapping(address => Identity) identities;

  event IdentityCreated(address indexed identity, address indexed owner, uint256 indexed at);
  event IdentityOffered(address indexed identity, address indexed owner, address offeredTo, uint256 indexed at);
  event IdentityTransferred(address indexed identity, address indexed owner, uint256 indexed at);
  event IdentityOfferRejected(address indexed identity, address owner, address indexed offeredTo, uint256 indexed at);
  event IdentityOfferCanceled(address indexed identity, address indexed owner, address oferedto, uint256 indexed at);
  
  constructor(address _libraryAddress) {
    libraryAddress = _libraryAddress;
  }
  
  modifier isOfferable() {
    require(
      ERC165Checker.supportsInterface(
        msg.sender, type(IOfferable).interfaceId
      ),
      "Only Offerable Identity allowed"
    );
    _;
  }
  
  modifier isOffered() {
    require(identities[msg.sender].offered, "IdentityManager: Identity is not offered");
    _;
  }
  
  function verified(address identity) public view returns (bool) {
    return identities[identity].verified;
  }

  function compliant(address identity) public view returns (bool) {
    return identities[identity].compliant;
  }
  
  function created(address identity) internal view returns (bool) {
    return identities[identity].created;
  }
  
  function offered(address identity) internal view returns (bool) {
    return identities[identity].offered;
  }
  
  function identityOwner(address identity) public view returns (address) {
    return identities[identity].owner;
  }

  function createIdentity(address _owner) external {
    address identity = Clones.clone(libraryAddress);
    identities[identity].created = true;
    
    bytes memory initData = abi.encodeWithSelector(INIT_SELECTOR, _owner);    
    Address.functionCall(identity, initData, "IdentityManager: Can't initialize cloned identity");
  }
  
  function identityCreated(address _owner)
    external
    isOfferable
  {
    if (created(msg.sender)) {
      identities[msg.sender].verified = true;      
    }
    else {
      identities[msg.sender].compliant = true;
    }
    require(identityOwner(msg.sender) == address(0), "IdentityManager: Identity already has been registered");
    identities[msg.sender].owner = _owner;
    emit IdentityCreated(msg.sender, _owner, block.timestamp);
  }

  function identityOffered(address _offeredTo)
    external
  {
    require(verified(msg.sender) || compliant(msg.sender), "IdentityManager: Not compliant identity can't be offered");
    identities[msg.sender].offered = true;
    emit IdentityOffered(msg.sender, identityOwner(msg.sender), _offeredTo, block.timestamp);
  }

  function identityAccepted(address _owner)
    external 
    isOffered
  {
    identities[msg.sender].owner = _owner;
    identities[msg.sender].offered = false;
    emit IdentityTransferred(msg.sender, _owner, block.timestamp);
  }

  function identityRejected(address _offeredTo)
    external
    isOffered
  {
    identities[msg.sender].offered = false;
    emit IdentityOfferRejected(msg.sender, identityOwner(msg.sender), _offeredTo, block.timestamp);
  }

  function identityOfferCanceled(address _offeredTo)
    external
    isOffered
  {
    identities[msg.sender].offered = false;
    emit IdentityOfferCanceled(msg.sender, identityOwner(msg.sender), _offeredTo, block.timestamp);
  }
}
