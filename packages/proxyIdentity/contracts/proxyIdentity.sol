pragma solidity 0.5.8;

contract ProxyIdentity {
    address[] recoveryAgents;

    address public owner;

    event TransactionSend(bytes data, address to, bool success);
    event IdentityOwner(address identity, bool success);

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

    function identityOwner(address identity, address to)
        public
        returns (address result)
    {
        bool success;
        bytes4 sig = bytes4(keccak256("identityOwner(address)"));
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let x := mload(0x40)
            mstore(x, sig)
            mstore(add(x, 0x04), identity)
            success := call(5000, to, 0, x, 0x24, x, 0x20)
            if eq(success, 0) {
                revert(0, 0)
            }
            result := mload(x)
            mstore(0x40, add(x, 0x44))
        }
        emit IdentityOwner(identity, success);
    }

    function execute(
        bytes calldata _data,
        address to,
        address first,
        address second
    ) external _owner {
        bool success;
        bytes4 sig = bytes4(keccak256("changeOwner(address,address)"));
        // string memory first = "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0";
        // string memory second = "0xB8427ADa6e4F5eCF98d6981Ae0A5B9CA3BB7B4c6";
        // address _owner = owner;
        // bytes memory data = _data;
        // address _identityOwner; //call to identityOwner()
        // uint256 len = data.length;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let x := mload(0x40) // Find empty storage location using "free memory pointer"
            mstore(x, sig)
            mstore(add(x, 0x04), first)
            mstore(add(x, 0x24), second)
            success := call(5000, to, 0, x, 0x44, 0, 0)
            if eq(success, 0) {
                revert(0, 0)
            }
            mstore(0x40, add(x, 0x64)) // Set storage pointer to new space
        }
        emit TransactionSend(_data, to, success);
    }

    // copied from GnosisSafe
    // https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/contracts/base/Executor.sol
    function _sendTransaction(bytes memory data, address to)
        internal
        returns (bool success)
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := call(gas, to, 0, add(data, 0x20), mload(data), 0, 0)
        }
    }

}
