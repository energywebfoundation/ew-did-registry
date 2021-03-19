pragma solidity 0.8.0;


contract IdentityManager {
  event IdentityCreated(address identity, address owner, uint at);
  event IdentityOffered(address identity, address offeredTo, uint at);
  event IdentityTransferred(address identity, address owner, uint at);
  event OfferRejected(address identity, address offeredTo, uint at);

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
    emit IdentityCreated(identity, owner, block.timestamp);
  }

  function identityOffered(address identity, address offeredTo)
    external
    isIdentity(msg.sender, identity)
  {
    emit IdentityOffered(identity, offeredTo, block.timestamp);
  }

  function identityAccepted(address identity, address owner)
    external
    isIdentity(msg.sender, identity)
  {
    emit IdentityTransferred(identity, owner, block.timestamp);
  }

  function identityRejected(address identity, address offeredTo)
    external
    isIdentity(msg.sender, identity)
  {
    emit OfferRejected(identity, offeredTo, block.timestamp);
  }
}
