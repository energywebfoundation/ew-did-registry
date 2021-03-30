pragma solidity 0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./OfferableIdentity.sol";


contract IdentityManager {
  address libraryAddress;
  address ethrRegistry;
  address owner;
  
  bytes4 constant ERC165ID = bytes4(keccak256("supportsInterface(bytes4)"));
  bytes4 constant offerID = bytes4(keccak256("offer(address)"));
  bytes4 constant acceptOfferID = bytes4(keccak256("acceptOffer()"));
  bytes4 constant rejectOfferID = bytes4(keccak256("rejectOffer()"));
  bytes4 constant cancelOfferID = bytes4(keccak256("cancelOffer()"));
  bytes4 constant sendTxID = bytes4(keccak256("sendTransaction(bytes,address,uin256)"));
  bytes4 constant offerableID = offerID ^
    acceptOfferID ^
    rejectOfferID ^
    cancelOfferID ^
    sendTxID;
  
  mapping(address => bool) public created;
  mapping(address => bool) public verified;  
  mapping(address => bool) public compliant;
  
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
    require(msg.sender == owner, "Only Identity Manager allowed");
    _;
  }
  
  modifier isOfferable() {
    require(
      ERC165Checker.supportsInterface(
        msg.sender, offerableID),
      "Only Offerable Identity allowed"
    );
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
    
    bytes memory initData = abi.encodeWithSignature("init(address,address)", _owner, ethrRegistry);    
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
    require(owners[msg.sender] == address(0), "Identity already has been registered");
    owners[msg.sender] = _owner;
    emit IdentityCreated(msg.sender, _owner, block.timestamp);
  }

  function identityOffered(address _offeredTo)
    external
  {
    emit IdentityOffered(msg.sender, owners[msg.sender], _offeredTo, block.timestamp);
  }

  function identityAccepted(address _owner)
    external
  {
    emit IdentityTransferred(msg.sender, _owner, block.timestamp);
  }

  function identityRejected(address _offeredTo)
    external
  {
    emit IdentityOfferRejected(msg.sender, owners[msg.sender], _offeredTo, block.timestamp);
  }

  function identityOfferCanceled(address _offeredTo)
    external
  {
    emit IdentityOfferCanceled(msg.sender, owners[msg.sender], _offeredTo, block.timestamp);
  }
}