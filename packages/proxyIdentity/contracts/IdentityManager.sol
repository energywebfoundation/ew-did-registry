pragma solidity ^0.5.0;


contract IdentityManager {
  event OfferableIdentityCreated(address identity, address owner);
  event IdentityOffered(address identity, address offeredTo);
  event IdentityTransferred(address identity, address owner);
  event OfferRejected(address identity, address offeredTo);

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
    emit OfferableIdentityCreated(identity, owner);
  }

  function identityOffered(address identity, address offeredTo)
    external
    isIdentity(msg.sender, identity)
  {
    emit IdentityOffered(identity, offeredTo);
  }

  function identityAccepted(address identity, address owner)
    external
    isIdentity(msg.sender, identity)
  {
    emit IdentityTransferred(identity, owner);
  }

  function identityRejected(address identity, address offeredTo)
    external
    isIdentity(msg.sender, identity)
  {
    emit OfferRejected(identity, offeredTo);
  }
}
