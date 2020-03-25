pragma solidity 0.5.8;

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

contract ProxyIdentity {
    address public creator;
    address public owner;
    address public erc1056;
    mapping(address => bool) recoveryAgents;
    uint256 defaultValidity = 2**256 - 1;
    mapping(bytes32 => bool) digests;

    event TransactionSent(bytes data, address to, uint256 value);
    event OwnerChanged(address identity, address prev, address next);
    event RecoveryAgentAdded(address agent);
    event RecoveryAgentRemoved(address agent);

    constructor(address _erc1056) public payable {
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

    function() external payable {}
}
