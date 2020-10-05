pragma solidity ^0.5.0;

import "multi-token-standard/contracts/tokens/ERC1155/ERC1155.sol";
import "multi-token-standard/contracts/tokens/ERC1155/ERC1155Metadata.sol";
import "../proxyIdentity.sol";

/**
 * @dev Implementation of the multi-token standard with tokens being a proxy identity contracts.
 */
contract ERC1155Multiproxy is ERC1155, ERC1155Metadata {
  mapping(uint256 => address payable) private proxies;

  constructor(string memory baseMetadataUri) public {
    _setBaseMetadataURI(baseMetadataUri);
  }

  modifier isOwnerOrApproved(address account) {
    require(
      account == msg.sender || isApprovedForAll(account, msg.sender),
      "ERC1155: caller is not owner nor approved"
    );
    _;
  }

  function mint(
    address receiver,
    uint256 id,
    bytes memory data
  ) public {
    _mint(receiver, id, 1, "");
    proxies[id] = msg.sender;
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public {
    super.safeTransferFrom(from, to, id, amount, data);
    if (amount == 1) {
      _onProxyOwnerChanged(id, to);
    }
  }

  function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public isOwnerOrApproved(from) {
    super.safeBatchTransferFrom(from, to, ids, amounts, data);
    for (uint256 i = 0; i < ids.length; i++) {
      if (amounts[i] == 1) {
        _onProxyOwnerChanged(ids[i], to);
      }
    }
  }

  function burn(address account, uint256 id) public isOwnerOrApproved(account) {
    _burn(account, id);
  }

  function burnBatch(address account, uint256[] memory ids)
    public
    isOwnerOrApproved(account)
  {
    for (uint256 i = 0; i < ids.length; i++) {
      _burn(account, ids[i]);
    }
  }

  function updateUri(string memory newBaseMetadataUri) public {
    _setBaseMetadataURI(newBaseMetadataUri);
  }

  function _burn(address account, uint256 id) internal {
    require(account != address(0), "ERC1155: burn from the zero address");

    uint256 amount = balances[account][id];

    address operator = msg.sender;

    balances[account][id] = 0;

    ProxyIdentity proxy = ProxyIdentity(proxies[id]);
    proxy.onBurn();
    proxies[id] = address(0);

    emit TransferSingle(operator, account, address(0), id, amount);
  }

  function _mint(
    address account,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) internal {
    require(account != address(0), "ERC1155: mint to the zero address");

    address operator = msg.sender;

    balances[account][id] = balances[account][id].add(amount);

    _callonERC1155Received(address(0), account, id, amount, gasleft(), data);

    emit TransferSingle(operator, address(0), account, id, amount);
  }

  function _onProxyOwnerChanged(uint256 id, address owner) internal {
    ProxyIdentity proxy = ProxyIdentity(proxies[id]);
    proxy.onOwnerChanged(owner);
  }
}
