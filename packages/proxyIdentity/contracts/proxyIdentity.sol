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
    event IdentityOwner(address identity, bool success);
    event ChangeOwner(address to, address first, address second);

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

    function sendTransaction(bytes calldata _data, address to) external _owner {
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

    function() external payable {}
}
