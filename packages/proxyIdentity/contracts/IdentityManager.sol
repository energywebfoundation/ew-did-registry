pragma solidity 0.8.0;


contract IdentityManager {
  mapping(address => address) owners;

  event IdentityCreated(
    address indexed identity,
    address indexed owner,
    uint256 indexed at
  );
  event IdentityOffered(
    address indexed identity,
    address indexed owner,
    address offeredTo,
    uint256 indexed at
  );
  event IdentityTransferred(
    address indexed identity,
    address indexed owner,
    uint256 indexed at
  );
  event IdentityOfferRejected(
    address indexed identity,
    address owner,
    address indexed offeredTo,
    uint256 indexed at
  );
  event IdentityOfferCanceled(
    address indexed identity,
    address indexed owner,
    address oferedto,
    uint256 indexed at
  );

  modifier isIdentity(address sender, address identity) {
    require(
      sender == identity,
      "Identity callback must be invoked by identity"
    );
    _;
  }

  function identityCreated(address identity, address owner)
    external
    isIdentity(msg.sender, identity)
  {
    owners[identity] = owner;
    emit IdentityCreated(identity, owner, block.timestamp);
  }

  function identityOffered(address identity, address offeredTo)
    external
    isIdentity(msg.sender, identity)
  {
    emit IdentityOffered(
      identity,
      owners[identity],
      offeredTo,
      block.timestamp
    );
  }

  function identityAccepted(address identity, address owner)
    external
    isIdentity(msg.sender, identity)
  {
    owners[identity] = owner;
    emit IdentityTransferred(identity, owner, block.timestamp);
  }

  function identityRejected(address identity, address offeredTo)
    external
    isIdentity(msg.sender, identity)
  {
    emit IdentityOfferRejected(
      identity,
      owners[identity],
      offeredTo,
      block.timestamp
    );
  }

  function identityOfferCanceled(address identity, address offeredTo)
    external
    isIdentity(msg.sender, identity)
  {
    emit IdentityOfferCanceled(
      identity,
      owners[identity],
      offeredTo,
      block.timestamp
    );
  }
}
