pragma solidity 0.5.8;

contract ProxyIdentity {
    address public owner;
    address erc1056;
    mapping(address => bool) recoveryAgents;
    uint256 defaultValidity = 10 * 60 * 1000;

    event TransactionSend(bytes data, address to, bool success);
    event SignedTransactionSend(address sender, address signer, bytes32 hash);
    event ChangeOwner(address identity, address prev, address next);
    event AddRecoveryAgent(address agent);

    constructor(address _erc1056) public payable {
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

    function sendTransaction(bytes memory _data, address to) public _owner {
        bool success;
        bytes memory data = _data;
        uint256 len = data.length;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := call(100000, to, 0, add(data, 0x20), len, 0, 0)
            if eq(success, 0) {
                revert(0, 0)
            }
        }
        emit TransactionSend(_data, to, success);
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
        sendTransaction(data, to);
        emit SignedTransactionSend(msg.sender, signer, hash);
    }

    function addRecoveryAgent(address agent) external _owner {
        recoveryAgents[agent] = true;
        emit AddRecoveryAgent(agent);
    }

    function changeOwner() external _recoveryAgent {
        _changeOwner(msg.sender);
    }

    /**
    * Used by the proxy factory to make sender the owner
     */
    function changeOwner(address newOwner) public _owner {
        _changeOwner(newOwner);
    }

    function _changeOwner(address newOwner) internal {
        emit ChangeOwner(address(this), owner, newOwner);
        owner = newOwner;
        _addOwnerToDelegates();
    }

    function _addOwnerToDelegates() internal {
        bytes32 delegateType;
        bytes memory bytesOfType = bytes("sigAugh");
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            delegateType := mload(add(bytesOfType, 0x20))
        }
        bytes memory payload = abi.encodeWithSignature(
            "addDelegate(address,bytes32,address,uint256)",
            address(this),
            delegateType,
            owner,
            defaultValidity
        );
        // solium-disable-next-line security/no-low-level-calls
        (bool success, ) = erc1056.call(payload);
        require(success, "Can't add owner to delegates");
    }

    function() external payable {}
}
