pragma solidity ^0.5.0;

import "multi-token-standard/contracts/tokens/ERC1155/ERC1155.sol";
import "../proxyIdentity.sol";

/**
 *
 * @dev Implementation of the multi-token standard with tokens being a proxy identity contracts.
 */
contract ERC1155Multiproxy is ERC1155 {
  mapping(uint256 => address payable) private proxies;
  
  function mint(address proxyCreator, uint256 id, bytes memory data) public {
    _mint(proxyCreator, id, 1, '');
    proxies[id] = msg.sender;
  }
  
  function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    )
        public
    {
      super.safeTransferFrom(from, to, id, amount, data);
      if (amount == 1) {
        _onProxyOwnerChanged(id, to);
      }
    }
    
    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    public
  {
    super.safeBatchTransferFrom(from, to, ids, amounts, data);
    for (uint256 i = 0; i < ids.length; i++) {
      if (amounts[i] == 1) {
        _onProxyOwnerChanged(ids[i], to);
      }
    }
  }
    
  function _mint(address account, uint256 id, uint256 amount, bytes memory data) internal {
    require(account != address(0), "ERC1155: mint to the zero address");

    address operator = msg.sender;

    balances[account][id] = balances[account][id].add(amount);
    emit TransferSingle(operator, address(0), account, id, amount);

    _callonERC1155Received(address(0), account, id, amount, gasleft(), data);
  }
  
  function _onProxyOwnerChanged(uint256 id, address owner) internal {
    ProxyIdentity proxy = ProxyIdentity(proxies[id]);
    proxy.onOwnerChanged(owner);
  }  
}
