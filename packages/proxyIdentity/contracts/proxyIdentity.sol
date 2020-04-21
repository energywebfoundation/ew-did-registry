pragma solidity ^0.5.0;

import './IERC165.sol';
import './IERC1155.sol';
import './IERC1155TokenReceiver.sol';

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

contract ProxyIdentity is IERC1155TokenReceiver, IERC165{
    address public creator;
    address public owner;
    address public erc1056;
    mapping(address => bool) recoveryAgents;
    uint256 defaultValidity = 2**256 - 1;
    mapping(bytes32 => bool) digests;
    bytes4 constant internal ERC1155_ACCEPTED = 0xf23a6e61;
    bytes4 constant internal ERC1155_BATCH_ACCEPTED = 0xbc197c81;

    event TransactionSent(bytes data, address to, uint256 value);
    event OwnerChanged(address identity, address prev, address next);
    event RecoveryAgentAdded(address agent);
    event RecoveryAgentRemoved(address agent);

    constructor(address _erc1056) public {
        erc1056 = _erc1056;
        creator = msg.sender;
        _changeOwner(msg.sender);
    }

    modifier _owner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    modifier _recoveryAgent() {
        require(
            recoveryAgents[msg.sender],
            "Only recovery agent can change the owner"
        );
        _;
    }

    function sendTransaction(bytes memory _data, address to, uint256 value)
        public
        payable
        _owner
    {
        require(_sendTransaction(_data, to, value), "Can't send transaction");
    }

    function _sendTransaction(bytes memory _data, address to, uint256 value)
        internal
        returns (bool success)
    {
        bytes memory data = _data;
        uint256 len = data.length;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := call(gas, to, value, add(data, 0x20), len, 0, 0)
        }
        emit TransactionSent(_data, to, value);
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
        require(
            digests[digest] == false,
            "This transaction has already been sent"
        );
        digests[digest] = true;
        bytes32 hash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", digest)
        );
        address signer = ecrecover(hash, v, r, s);
        require(owner == signer, "Signature is not valid");
        require(_sendTransaction(data, to, value), "Can't send transaction");
    }

    function addRecoveryAgent(address agent) public _owner {
        _addRecoveryAgent(agent);
    }

    function _addRecoveryAgent(address agent) internal {
        recoveryAgents[agent] = true;
        emit RecoveryAgentAdded(agent);
    }

    function removeRecoveryAgent(address agent) public _recoveryAgent {
        recoveryAgents[agent] = false;
        emit RecoveryAgentRemoved(agent);
    }

    /**
    * Used by the proxy factory to make sender the owner
     */
    function changeOwner(address newOwner) public _recoveryAgent {
        _changeOwner(newOwner);
    }

    function _changeOwner(address newOwner) internal {
        address oldOwner = owner;
        if (owner != address(0x0)) {
            removeRecoveryAgent(owner);
            _revokeDelegate(owner);
        }
        owner = newOwner;
        _addRecoveryAgent(newOwner);
        _addDelegate(newOwner);
        emit OwnerChanged(address(this), oldOwner, newOwner);
    }

    function _addDelegate(address delegate) internal {
        IERC1056(erc1056).addDelegate(
            address(this),
            "sigAuth",
            delegate,
            defaultValidity
        );
    }

    function _revokeDelegate(address delegate) internal {
        IERC1056(erc1056).revokeDelegate(address(this), "sigAuth", delegate);
    }

    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external returns (bytes4) {
        IERC1155(msg.sender).safeTransferFrom(address(this), owner, _id, _value, _data);
        return ERC1155_ACCEPTED;
    }

    function onERC1155BatchReceived(
        address _operator,
        address _from,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external returns (bytes4) {
        IERC1155(msg.sender).safeBatchTransferFrom(address(this), owner, _ids, _values, _data);
        return ERC1155_BATCH_ACCEPTED;
    }

    /**
    * INTERFACE_SIGNATURE_ERC165 = bytes4(keccak256("supportsInterface(bytes4)"));
    */
    bytes4 constant private INTERFACE_SIGNATURE_ERC165 = 0x01ffc9a7;

    /**
    * bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))^bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))
    */
    bytes4 constant private INTERFACE_SIGNATURE_ERC1155TOKENRECEIVER = 0x4e2312e0;

    /**
    * @notice Query if a contract implements an interface
    * @param _interfaceID  The interface identifier, as specified in ERC-165
    * @return `true` if the contract implements `_interfaceID` and
    */
    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
      if (_interfaceID == INTERFACE_SIGNATURE_ERC165 ||
          _interfaceID == INTERFACE_SIGNATURE_ERC1155TOKENRECEIVER) {
        return true;
      }
      return false;
    }

    function() external payable {}
}
