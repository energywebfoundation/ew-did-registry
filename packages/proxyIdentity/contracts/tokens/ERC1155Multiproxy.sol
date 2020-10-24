pragma solidity ^0.5.0;

import "multi-token-standard/contracts/tokens/ERC1155/ERC1155MintBurn.sol";
import "multi-token-standard/contracts/tokens/ERC1155/ERC1155Metadata.sol";
import "../proxyIdentity.sol";

/**
* Is there smth should happen in proxy on token burn?
 */
contract ERC1155Multiproxy is ERC1155MintBurn, ERC1155Metadata {
  mapping(uint256 => string) uris;
  mapping(uint256 => address) owners;
  uint256 public tokenCount;
  
  function uri(uint256 id) public view returns(string memory) {
    return uris[id];
  }
  
  function updateUri(uint256 id, string memory _uri) public {
    require(owners[id] == msg.sender, "Only owner can update uri");
    uris[id] = _uri;
  }
  
  function mint(uint256 id) public {
    _mint(msg.sender, id, 1, "0x0");
    owners[id] = msg.sender;
    tokenCount++;
  }
}
