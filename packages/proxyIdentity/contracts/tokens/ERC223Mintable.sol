pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "../interfaces/IERC223.sol";
import "../interfaces/IERC223Receiver.sol";


contract ERC223Mintable is IERC223, ERC20Mintable {
  function transfer(
    address _to,
    uint256 _value,
    bytes memory _data
  ) public returns (bool) {
    super.transfer(_to, _value);
    if (isContract(_to)) {
      return contractFallback(msg.sender, _to, _value, _data);
    }
    return true;
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value,
    bytes memory _data
  ) public returns (bool) {
    super.transferFrom(_from, _to, _value);
    if (isContract(_to)) return contractFallback(_from, _to, _value, _data);
    return true;
  }

  function transfer(address _to, uint256 _value) public returns (bool) {
    return transfer(_to, _value, new bytes(0));
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  ) public returns (bool) {
    return transferFrom(_from, _to, _value, new bytes(0));
  }

  function contractFallback(
    address _origin,
    address _to,
    uint256 _value,
    bytes memory _data
  ) private returns (bool success) {
    IERC223Receiver reciever = IERC223Receiver(_to);
    return reciever.tokenFallback(msg.sender, _origin, _value, _data);
  }

  function isContract(address _addr) private returns (bool is_contract) {
    uint256 length;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      length := extcodesize(_addr)
    }
    return length > 0;
  }
}
