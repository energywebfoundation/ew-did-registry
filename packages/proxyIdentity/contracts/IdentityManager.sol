pragma solidity 0.8.3;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./OfferableIdentity.sol";
import "./IOfferable.sol";


contract IdentityManager {
  address libraryAddress;
  address ethrRegistry;
  address owner;
  
  bytes4 private constant INIT_SELECTOR = bytes4(keccak256(bytes('init(address)')));
  
  mapping(address => bool) created;
  mapping(address => bool) public verified;  
  mapping(address => bool) public compliant;
  mapping(address => bool) offered;
  
  mapping(address => address) public owners;

  event IdentityCreated(address indexed identity, address indexed owner, uint256 indexed at);
  event IdentityOffered(address indexed identity, address indexed owner, address offeredTo, uint256 indexed at);
  event IdentityTransferred(address indexed identity, address indexed owner, uint256 indexed at);
  event IdentityOfferRejected(address indexed identity, address owner, address indexed offeredTo, uint256 indexed at);
  event IdentityOfferCanceled(address indexed identity, address indexed owner, address oferedto, uint256 indexed at);
  
  constructor() {
    owner = msg.sender;
  }

  modifier isOwner() {
    require(msg.sender == owner, "IdentityManager: Only Manager owner allowed");
    _;
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
    require(offered[msg.sender], "IdentityManager: Identity is not offered");
    _;
  }

  function setLibraryAddress(address _libraryAddress) external isOwner {
    libraryAddress = _libraryAddress;
  }
  
  function setEthrRegistry(address _ethrRegistry) external isOwner {
    ethrRegistry = _ethrRegistry; 
  }

  function createIdentity(address _owner) external {
    address identity = Clones.clone(libraryAddress);
    created[identity] = true;
    
    bytes memory initData = abi.encodeWithSelector(INIT_SELECTOR, _owner);    
    Address.functionCall(identity, initData, "IdentityManager: Can't initialize cloned identity");
  }
  
  function identityCreated(address _owner)
    external
    isOfferable
  {
    if (created[msg.sender]) {
      verified[msg.sender] = true;      
    }
    else {
      compliant[msg.sender] = true;
    }
    require(owners[msg.sender] == address(0), "IdentityManager: Identity already has been registered");
    owners[msg.sender] = _owner;
    emit IdentityCreated(msg.sender, _owner, block.timestamp);
  }

  function identityOffered(address _offeredTo)
    external
  {
    require(verified[msg.sender] || compliant[msg.sender], "IdentityManager: Not compliant identity can't be offered");
    offered[msg.sender] = true;
    emit IdentityOffered(msg.sender, owners[msg.sender], _offeredTo, block.timestamp);
  }

  function identityAccepted(address _owner)
    external 
    isOffered
  {
    offered[msg.sender] = false;
    emit IdentityTransferred(msg.sender, _owner, block.timestamp);
  }

  function identityRejected(address _offeredTo)
    external
    isOffered
  {
    offered[msg.sender] = false;
    emit IdentityOfferRejected(msg.sender, owners[msg.sender], _offeredTo, block.timestamp);
  }

  function identityOfferCanceled(address _offeredTo)
    external
    isOffered
  {
    offered[msg.sender] = false;
    emit IdentityOfferCanceled(msg.sender, owners[msg.sender], _offeredTo, block.timestamp);
  }
}