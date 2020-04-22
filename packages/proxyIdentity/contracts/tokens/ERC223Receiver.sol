pragma solidity ^0.5.0;

import "../interfaces/IERC223Receiver.sol";


contract ERC223Receiver is IERC223Receiver {
  Tkn tkn;

  struct Tkn {
    address addr;
    address sender;
    address origin;
    uint256 value;
    bytes data;
    bytes4 sig;
  }

  function tokenFallback(
    address _sender,
    address _origin,
    uint256 _value,
    bytes memory _data
  ) public returns (bool ok) {
    if (!supportsToken(msg.sender)) return false;
    tkn = Tkn(msg.sender, _sender, _origin, _value, _data, getSig(_data));
    __isTokenFallback = true;
    // solium-disable-next-line security/no-low-level-calls
    (bool success, ) = address(this).delegatecall(_data);
    if (!success) return false;
    __isTokenFallback = false;
    return true;
  }

  function getSig(bytes memory _data) private returns (bytes4 sig) {
    uint256 l = _data.length < 4 ? _data.length : 4;
    for (uint256 i = 0; i < l; i++) {
      sig = bytes4(
        uint32(uint32(sig) + uint8(_data[i]) * (2**(8 * (l - 1 - i))))
      );
    }
  }

  bool __isTokenFallback;

  modifier tokenPayable {
    if (!__isTokenFallback)
      revert("Method can be invoked only as part of ERC223 transfer");
    _;
  }

  // TODO: check if token - is IERC223
  function supportsToken(address token) public returns (bool) {
    return true;
  }
}
