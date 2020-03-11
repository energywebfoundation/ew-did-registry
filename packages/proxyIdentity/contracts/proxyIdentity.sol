pragma solidity 0.5.8;

contract ProxyIdentity {
    address[] recoveryAgents;

    address public owner;

    event TransactionSend(
        bytes data,
        address to,
        bool success,
        bytes4 sig,
        uint256 len
    );
    event SignedTransactionSend(address sender, address signer, bytes32 hash);

    constructor() public {
        owner = msg.sender;
        // @TODO: set sender as proxy owner
    }

    modifier _owner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    modifier _recoveryAgent() {
        bool found = false;
        for (uint256 i = 0; i < recoveryAgents.length; i++) {
            if (recoveryAgents[i] == msg.sender) {
                found = true;
                break;
            }
        }
        require(found, "Only recovery agent can change the owner");
        _;
    }

    function sendTransaction(bytes memory _data, address to) public _owner {
        bool success;
        bytes memory data = _data;
        uint256 len = data.length;
        bytes4 sig = bytes4(keccak256("changeOwner(address,address)"));
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := call(100000, to, 0, add(data, 0x20), len, 0, 0)
            if eq(success, 0) {
                revert(0, 0)
            }
        }
        emit TransactionSend(_data, to, success, sig, len);
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

    function() external payable {}
}
