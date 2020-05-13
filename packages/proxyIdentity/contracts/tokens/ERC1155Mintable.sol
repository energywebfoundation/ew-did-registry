pragma solidity ^0.5.0;

import "multi-token-standard/contracts/tokens/ERC1155/ERC1155.sol";


contract ERC1155MintBurn is ERC1155 {
  function mint(
    address _to,
    uint256 _id,
    uint256 _amount,
    bytes memory _data
  ) public {
    balances[_to][_id] = balances[_to][_id].add(_amount);
    emit TransferSingle(msg.sender, address(0x0), _to, _id, _amount);
    _callonERC1155Received(address(0x0), _to, _id, _amount, gasleft(), _data);
  }

  function batchMint(
    address _to,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory _data
  ) public {
    require(
      _ids.length == _amounts.length,
      "ERC1155MintBurn#batchMint: INVALID_ARRAYS_LENGTH"
    );
    uint256 nMint = _ids.length;
    for (uint256 i = 0; i < nMint; i++) {
      balances[_to][_ids[i]] = balances[_to][_ids[i]].add(_amounts[i]);
    }
    emit TransferBatch(msg.sender, address(0x0), _to, _ids, _amounts);
    _callonERC1155BatchReceived(
      address(0x0),
      _to,
      _ids,
      _amounts,
      gasleft(),
      _data
    );
  }

  function burn(
    address _from,
    uint256 _id,
    uint256 _amount
  ) public {
    balances[_from][_id] = balances[_from][_id].sub(_amount);

    emit TransferSingle(msg.sender, _from, address(0x0), _id, _amount);
  }

  function batchBurn(
    address _from,
    uint256[] memory _ids,
    uint256[] memory _amounts
  ) public {
    uint256 nBurn = _ids.length;
    require(
      nBurn == _amounts.length,
      "ERC1155MintBurn#batchBurn: INVALID_ARRAYS_LENGTH"
    );
    for (uint256 i = 0; i < nBurn; i++) {
      balances[_from][_ids[i]] = balances[_from][_ids[i]].sub(_amounts[i]);
    }
    emit TransferBatch(msg.sender, _from, address(0x0), _ids, _amounts);
  }
}
