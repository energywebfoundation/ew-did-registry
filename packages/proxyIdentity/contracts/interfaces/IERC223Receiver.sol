pragma solidity ^0.5.0;


interface IERC223Receiver {
  function tokenFallback(
    address _sender,
    address _origin,
    uint256 _value,
    bytes calldata _data
  ) external returns (bool);
}
