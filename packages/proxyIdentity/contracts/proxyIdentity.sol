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
    address public owner;
    address erc1056;
    mapping(address => bool) recoveryAgents;
    uint256 defaultValidity = 10 * 60 * 1000;

    event TransactionSent(bytes data, address to, bool success);
    event ChangeOwner(address identity, address prev, address next);
    event AddRecoveryAgent(address agent);
    event RemoveRecoveryAgent(address agent);

    constructor(address _erc1056) public {
        erc1056 = _erc1056;
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

    function sendTransaction(bytes memory _data, address to)
        public
        payable
        _owner
    {
        require(
            _sendTransaction(_data, to, msg.value),
            "Can't send transaction"
        );
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
        emit TransactionSent(_data, to, success);
    }

    function sendSignedTransaction(
        bytes memory data,
        address to,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public payable {
        bytes32 digest = keccak256(data);
        bytes32 hash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", digest)
        );
        address signer = ecrecover(hash, v, r, s);
        require(owner == signer, "Signature is not valid");
        require(
            _sendTransaction(data, to, msg.value),
            "Can't send transaction"
        );
    }

    function addRecoveryAgent(address agent) public _owner {
        recoveryAgents[agent] = true;
        emit AddRecoveryAgent(agent);
    }

    function removeRecoveryAgent(address agent) public _recoveryAgent {
        recoveryAgents[agent] = false;
        emit RemoveRecoveryAgent(agent);
    }

    function changeOwner() external _recoveryAgent {
        _changeOwner(msg.sender);
    }

    function _changeOwner(address newOwner) internal {
        address oldOwner = owner;
        if (owner != address(0x0)) {
            removeRecoveryAgent(owner);
            _revokeDelegate(owner);
        }
        owner = newOwner;
        addRecoveryAgent(owner);
        _addDelegate(owner);
        emit ChangeOwner(address(this), oldOwner, newOwner);
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
