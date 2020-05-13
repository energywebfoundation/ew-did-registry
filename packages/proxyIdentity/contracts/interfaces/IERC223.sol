pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IERC223 {
  function transfer(
    address to,
    uint256 value,
    bytes calldata data
  ) external returns (bool);

  function transferFrom(
    address from,
    address to,
    uint256 value,
    bytes calldata data
  ) external returns (bool);
}
