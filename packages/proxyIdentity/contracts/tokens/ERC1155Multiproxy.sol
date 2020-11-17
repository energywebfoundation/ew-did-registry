pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "multi-token-standard/contracts/tokens/ERC1155/ERC1155.sol";
import "multi-token-standard/contracts/tokens/ERC1155/ERC1155Metadata.sol";
import "../proxyIdentity.sol";

/**
 * @dev Implementation of the multi-token standard with tokens being a proxy identity contracts
 * Todo    1. On mint check if token with given id already exists
 *         2. Only ProxyIdentity contract allowed to mint its token
 */
contract ERC1155Multiproxy is ERC1155, ERC1155Metadata {
  struct Proxy {
    uint256 id;
    address payable itsAddress;
    address owner;
    address creator;
    string metadataUri;
  }

  mapping(string => Proxy) public proxies;
  string[] public serials;

  modifier isOwnerOrApproved(address account) {
    require(
      account == msg.sender || isApprovedForAll(account, msg.sender),
      "ERC1155: caller is not owner nor approved"
    );
    _;
  }

  /**
   * @notice Invoked only by proxy when it is created
   */
  function mint(
    address owner,
    address creator,
    string memory serial,
    bytes memory data
  ) public {
    serials.push(serial);
    proxies[serial] = Proxy(serials.length, msg.sender, owner, creator, "");
    _mint(owner, proxies[serial].id, "");
  }

  function transfer(
    address from,
    address to,
    string memory serial,
    uint256 amount,
    bytes memory data
  ) public {
    uint256 id = proxies[serial].id;
    super.safeTransferFrom(from, to, id, amount, data);
    if (amount == 1) {
      proxies[serial].owner = to;
      _onProxyOwnerChanged(serial, to);
    }
  }

  function transferBatch(
    address from,
    address to,
    string[] memory _serials,
    uint256[] memory amounts,
    bytes memory data
  ) public {
    uint256[] memory ids = _idsBySerials(_serials);
    super.safeBatchTransferFrom(from, to, ids, amounts, data);
    for (uint256 i = 0; i < _serials.length; i++) {
      if (amounts[i] == 1) {
        proxies[_serials[i]].owner = to;
        _onProxyOwnerChanged(_serials[i], to);
      }
    }
  }

  function balance(address _owner, string memory _serial)
    public
    view
    returns (uint256)
  {
    return super.balanceOf(_owner, proxies[_serial].id);
  }

  function balanceBatch(address[] memory _owners, string[] memory _serials)
    public
    view
    returns (uint256[] memory)
  {
    return super.balanceOfBatch(_owners, _idsBySerials(_serials));
  }

  function burn(address account, string memory serial)
    public
    isOwnerOrApproved(account)
  {
    _burn(account, serial);
  }

  function burnBatch(address account, string[] memory _serials)
    public
    isOwnerOrApproved(account)
  {
    for (uint256 i = 0; i < serials.length; i++) {
      _burn(account, _serials[i]);
    }
  }

  function updateUri(string memory serial, string memory uri)
    public
    isOwnerOrApproved(proxies[serial].owner)
  {
    proxies[serial].metadataUri = uri;
  }

  function uri(string memory serial) public view returns (string memory) {
    return proxies[serial].metadataUri;
  }

  function tokensOwnedBy(address owner)
    public
    view
    returns (string[] memory result)
  {
    string[] memory owned = new string[](serials.length);
    uint256 count = 0;
    for (uint256 i = 0; i < serials.length; i++) {
      if (proxies[serials[i]].owner == owner) {
        owned[count++] = serials[i];
      }
    }
    result = new string[](count);
    for (uint256 i = 0; i < count; i++) {
      result[i] = owned[i];
    }
  }

  function tokensCreatedBy(address creator)
    public
    view
    returns (string[] memory result)
  {
    string[] memory created = new string[](serials.length);
    uint256 count = 0;
    for (uint256 i = 0; i < serials.length; i++) {
      if (proxies[serials[i]].creator == creator) {
        created[count++] = serials[i];
      }
    }
    result = new string[](count);
    for (uint256 i = 0; i < count; i++) {
      result[i] = created[i];
    }
  }

  function allTokens() public view returns (string[] memory) {
    return serials;
  }

  function _burn(address account, string memory serial) internal {
    require(account != address(0), "ERC1155: burn from the zero address");

    uint256 id = proxies[serial].id;
    uint256 amount = balances[account][id];

    address operator = msg.sender;

    balances[account][id] = 0;

    ProxyIdentity proxy = ProxyIdentity(proxies[serial].itsAddress);
    proxy.onBurn();
    proxies[serial] = Proxy(id, address(0), address(0), address(0), "");

    emit TransferSingle(operator, account, address(0), id, amount);
  }

  function _mint(
    address account,
    uint256 id,
    bytes memory data
  ) internal {
    require(account != address(0), "ERC1155: mint to the zero address");

    address operator = msg.sender;

    balances[account][id] = 1;

    _callonERC1155Received(address(0), account, id, 1, gasleft(), data);

    emit TransferSingle(operator, address(0), account, id, 1);
  }

  function _onProxyOwnerChanged(string memory serial, address owner) internal {
    ProxyIdentity proxy = ProxyIdentity(proxies[serial].itsAddress);
    proxy.onOwnerChanged(owner);
  }

  function _idsBySerials(string[] memory _serials)
    internal
    view
    returns (uint256[] memory ids)
  {
    ids = new uint256[](_serials.length);
    for (uint256 i = 0; i < _serials.length; i++) {
      ids[i] = proxies[_serials[i]].id;
    }
  }
}
