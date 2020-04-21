pragma solidity ^0.5.0;


interface IERC1155 {
  event TransferSingle(
    address indexed _operator,
    address indexed _from,
    address indexed _to,
    uint256 _id,
    uint256 _amount
  );

  event TransferBatch(
    address indexed _operator,
    address indexed _from,
    address indexed _to,
    uint256[] _ids,
    uint256[] _amounts
  );

  event ApprovalForAll(
    address indexed _owner,
    address indexed _operator,
    bool _approved
  );

  event URI(string _amount, uint256 indexed _id);

  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _id,
    uint256 _amount,
    bytes calldata _data
  ) external;

  function safeBatchTransferFrom(
    address _from,
    address _to,
    uint256[] calldata _ids,
    uint256[] calldata _amounts,
    bytes calldata _data
  ) external;

  function balanceOf(address _owner, uint256 _id)
    external
    view
    returns (uint256);

  function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids)
    external
    view
    returns (uint256[] memory);

  function setApprovalForAll(address _operator, bool _approved) external;

  function isApprovedForAll(address _owner, address _operator)
    external
    view
    returns (bool isOperator);
}
