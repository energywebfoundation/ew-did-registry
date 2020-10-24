pragma solidity ^0.5.0;

import "multi-token-standard/contracts/interfaces/IERC165.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "multi-token-standard/contracts/interfaces/IERC1155TokenReceiver.sol";
import "./interfaces/IERC223Receiver.sol";
import "./interfaces/IERC223.sol";
import "./tokens/ERC1155Multiproxy.sol";

interface IERC1056 {
  function addDelegate(
    address identity,
    bytes32 delegateType,
    address delegate,
    uint256 validity
  ) external;

  function revokeDelegate(
    address identity,
    bytes32 delegateType,
    address delegate
  ) external;
}

contract ProxyIdentity is IERC1155TokenReceiver, IERC165, IERC223Receiver {
  address public owner;
  address[] public agents;
  address public creator;
  address public erc1056;
  address public erc1155;
  uint256 defaultValidity = 2**256 - 1;
  mapping(bytes32 => bool) digests;
  bytes4 internal constant ERC1155_ACCEPTED = 0xf23a6e61;
  bytes4 internal constant ERC1155_BATCH_ACCEPTED = 0xbc197c81;
  Tkn tkn;
  bool __isTokenFallback;
  string serial;
  uint256 id;
  mapping(address => bool) isApproved;

  struct Tkn {
    address addr;
    address sender;
    address origin;
    uint256 value;
    bytes data;
    bytes4 sig;
  }

  event TransactionSent(bytes data, address to, uint256 value);
  event ApprovedAgentAdded(address agent);
  event ApprovedAgentRemoved(address agent);

  constructor(
    address _erc1056,
    address _erc1155,
    string memory _serial,
    address _owner
  ) public {
    erc1056 = _erc1056;
    erc1155 = _erc1155;
    serial = _serial;
    creator = msg.sender;
    owner = _owner;
    id = ERC1155Multiproxy(_erc1155).tokenCount();
    ERC1155Multiproxy(_erc1155).mint(id);
    _addDelegate(_owner);
  }

  modifier _owner() {
    require(msg.sender == owner, "Only owner allowed");
    _;
  }

  modifier isOwnerOrApproved() {
    require(
      msg.sender == owner || isApproved[msg.sender],
      "ProxyIdentity: Only owner or approved agent allowed"
    );
    _;
  }

  modifier tokenPayable {
    if (!__isTokenFallback)
      revert("Method can be invoked only as part of ERC223 transfer");
    _;
  }

  function sendTransaction(
    bytes memory _data,
    address to,
    uint256 value
  ) public payable _owner() {
    require(_sendTransaction(_data, to, value), "Can't send transaction");
  }

  function sendSignedTransaction(
    bytes memory data,
    address to,
    uint8 v,
    bytes32 r,
    bytes32 s,
    uint256 value,
    uint256 nonce
  ) public payable {
    bytes32 digest = keccak256(abi.encode(data, to, value, nonce));
    require(digests[digest] == false, "This transaction has already been sent");
    digests[digest] = true;
    bytes32 hash = keccak256(
      abi.encodePacked("\x19Ethereum Signed Message:\n32", digest)
    );
    address signer = ecrecover(hash, v, r, s);
    require(
      signer == owner,
      "Signature is not valid"
    );
    require(_sendTransaction(data, to, value), "Can't send transaction");
  }

  function addDelegate(address delegate) public _owner() {
    _addDelegate(delegate);
  }

  function revokeDelegate(address delegate) public _owner() {
    IERC1056(erc1056).revokeDelegate(address(this), "sigAuth", delegate);
  }

  function changeOwner(address newOwner) public isOwnerOrApproved {
    owner = newOwner;
  }

  function addApprovedAgent(address agent) public isOwnerOrApproved {
    isApproved[agent] = true;
    ERC1155Multiproxy(erc1155).setApprovalForAll(agent, true);
  }

  function removeApprovedAgent(address agent) public isOwnerOrApproved {
    isApproved[agent] = false;
    ERC1155Multiproxy(erc1155).setApprovalForAll(agent, false);
  }

  function uri() public view returns (string memory) {
    return ERC1155Multiproxy(erc1155).uri(id);
  }

  function updateUri(string memory uri) public {
    ERC1155Multiproxy(erc1155).updateUri(id, uri);
  }

  function onERC1155Received(
    address _operator,
    address _from,
    uint256 _id,
    uint256 _value,
    bytes calldata _data
  ) external returns (bytes4) {
    return ERC1155_ACCEPTED;
  }

  function onERC1155BatchReceived(
    address _operator,
    address _from,
    uint256[] calldata _ids,
    uint256[] calldata _values,
    bytes calldata _data
  ) external returns (bytes4) {
    return ERC1155_BATCH_ACCEPTED;
  }

  function _sendTransaction(
    bytes memory _data,
    address to,
    uint256 value
  ) internal returns (bool success) {
    bytes memory data = _data;
    uint256 len = data.length;
    // solium-disable-next-line security/no-inline-assembly
    assembly {
      success := call(gas, to, value, add(data, 0x20), len, 0, 0)
    }
    emit TransactionSent(_data, to, value);
  }

  function _addDelegate(address delegate) internal {
    IERC1056(erc1056).addDelegate(
      address(this),
      "sigAuth",
      delegate,
      defaultValidity
    );
  }

  /**
   * INTERFACE_SIGNATURE_ERC165 = bytes4(keccak256("supportsInterface(bytes4)"));
   */
  bytes4 private constant INTERFACE_SIGNATURE_ERC165 = 0x01ffc9a7;

  /**
   * bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))^bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))
   */
  bytes4 private constant INTERFACE_SIGNATURE_ERC1155TOKENRECEIVER = 0x4e2312e0;

  /**
   * @notice Query if a contract implements an interface
   * @param _interfaceID  The interface identifier, as specified in ERC-165
   * @return `true` if the contract implements `_interfaceID` and
   */
  function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
    if (
      _interfaceID == INTERFACE_SIGNATURE_ERC165 ||
      _interfaceID == INTERFACE_SIGNATURE_ERC1155TOKENRECEIVER
    ) {
      return true;
    }
    return false;
  }

  event CallbackOnTransfer(bytes data, bool success, address sender);

  function tokenFallback(
    address _sender,
    address _origin,
    uint256 _value,
    bytes memory _data
  ) public returns (bool) {
    if (!supportsToken(msg.sender)) return false;
    __isTokenFallback = true;
    // solium-disable-next-line security/no-low-level-calls
    (bool success, ) = address(this).delegatecall(_data);
    __isTokenFallback = false;
    emit CallbackOnTransfer(_data, success, msg.sender);
    return success;
  }

  function getSig(bytes memory _data) private pure returns (bytes4 sig) {
    uint256 l = _data.length < 4 ? _data.length : 4;
    for (uint256 i = 0; i < l; i++) {
      sig = bytes4(
        uint32(uint32(sig) + uint8(_data[i]) * (2**(8 * (l - 1 - i))))
      );
    }
  }

  function supportsToken(address token) public pure returns (bool) {
    return true;
  }

  function() external payable {}
}
