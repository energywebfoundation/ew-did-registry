pragma solidity ^0.8.4;

import "IERC721.sol";

contract NftDIDRegistry {

    mapping(address => mapping(uint256 => mapping(bytes32 => mapping(address => uint)))) public delegates;
    mapping(address => mapping(uint256 => uint)) public changed;
    mapping(address => uint) public nonce;

    modifier onlyOwner(address nft_contract, uint256 nft_id, address actor) {
        require (actor == identityOwner(nft_contract, nft_id));
        _;
    }

    event DIDDelegateChanged(
        address indexed nft_contract,
        uint256 indexed nft_id,
        bytes32 delegateType,
        address delegate,
        uint validTo,
        uint previousChange
    );

    event DIDAttributeChanged(
        address indexed nft_contract,
        uint256 indexed nft_id,
        bytes32 name,
        bytes value,
        uint validTo,
        uint previousChange
    );

    function identityOwner(address nft_contract, uint256 nft_id) public view returns(address) {
        // check here if the contract address supports IERC721 interface.
        return IERC721(nft_contract).ownerOf(nft_id);
    }

    function checkSignature(address nft_contract, uint256 nft_id, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 hash) internal returns(address) {
        address signer = ecrecover(hash, sigV, sigR, sigS);
        require(signer == identityOwner(nft_contract, nft_id));
        nonce[signer]++;
        return signer;
    }

    function validDelegate(address nft_contract, uint256 nft_id, bytes32 delegateType, address delegate) public view returns(bool) {
        uint validity = delegates[nft_contract][nft_id][keccak256(abi.encodePacked(delegateType))][delegate];
        return (validity > block.timestamp);
    }

    function addDelegate(address nft_contract, uint256 nft_id, address actor, bytes32 delegateType, address delegate, uint validity) internal onlyOwner(nft_contract, nft_id, actor) {
        delegates[nft_contract][nft_id][keccak256(abi.encodePacked(delegateType))][delegate] = block.timestamp + validity;
        uint previousChange = changed[nft_contract][nft_id];
        emit DIDDelegateChanged(nft_contract, nft_id, delegateType, delegate, block.timestamp + validity, previousChange);
        changed[nft_contract][nft_id] = block.number;
    }

    function addDelegate(address nft_contract, uint256 nft_id, bytes32 delegateType, address delegate, uint validity) public {
        addDelegate(nft_contract, nft_id, msg.sender, delegateType, delegate, validity);
    }

    function addDelegateSigned(address nft_contract, uint256 nft_id, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 delegateType, address delegate, uint validity) public {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), this, nonce[identityOwner(nft_contract, nft_id)], nft_contract, "addDelegate", delegateType, delegate, validity));
        addDelegate(nft_contract, nft_id, checkSignature(nft_contract, nft_id, sigV, sigR, sigS, hash), delegateType, delegate, validity);
    }

    function revokeDelegate(address nft_contract, uint256 nft_id, address actor, bytes32 delegateType, address delegate) internal onlyOwner(nft_contract, nft_id, actor) {
        delegates[nft_contract][nft_id][keccak256(abi.encodePacked(delegateType))][delegate] = block.timestamp;
        uint previousChange = changed[nft_contract][nft_id];
        emit DIDDelegateChanged(nft_contract, nft_id, delegateType, delegate, block.timestamp, previousChange);
        changed[nft_contract][nft_id] = block.number;
    }

    function revokeDelegate(address nft_contract, uint256 nft_id, bytes32 delegateType, address delegate) public {
        revokeDelegate(nft_contract, nft_id, msg.sender, delegateType, delegate);
    }

    function revokeDelegateSigned(address nft_contract, uint256 nft_id, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 delegateType, address delegate) public {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), this, nonce[identityOwner(nft_contract, nft_id)], nft_contract, "revokeDelegate", delegateType, delegate));
        revokeDelegate(nft_contract, nft_id, checkSignature(nft_contract, nft_id, sigV, sigR, sigS, hash), delegateType, delegate);
    }

    function setAttribute(address nft_contract, uint256 nft_id, address actor, bytes32 name, bytes calldata value, uint validity ) internal onlyOwner(nft_contract, nft_id, actor) {
        uint previousChange = changed[nft_contract][nft_id];
        emit DIDAttributeChanged(nft_contract, nft_id, name, value, block.timestamp + validity, previousChange);
        changed[nft_contract][nft_id] = block.number;
    }

    function setAttribute(address nft_contract, uint256 nft_id, bytes32 name, bytes calldata value, uint validity) public {
        setAttribute(nft_contract, nft_id, msg.sender, name, value, validity);
    }

    function setAttributeSigned(address nft_contract, uint256 nft_id, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 name, bytes calldata value, uint validity) public {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), this, nonce[identityOwner(nft_contract, nft_id)], nft_contract, "setAttribute", name, value, validity));
        setAttribute(nft_contract, nft_id, checkSignature(nft_contract, nft_id, sigV, sigR, sigS, hash), name, value, validity);
    }

    function revokeAttribute(address nft_contract, uint256 nft_id, address actor, bytes32 name, bytes calldata value ) internal onlyOwner(nft_contract, nft_id, actor) {
        uint previousChange = changed[nft_contract][nft_id];
        emit DIDAttributeChanged(nft_contract, nft_id, name, value, 0, previousChange);
        changed[nft_contract][nft_id] = block.number;
    }

    function revokeAttribute(address nft_contract, uint256 nft_id, bytes32 name, bytes calldata value) public {
        revokeAttribute(nft_contract, nft_id, msg.sender, name, value);
    }

    function revokeAttributeSigned(address nft_contract, uint256 nft_id, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 name, bytes calldata value) public {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), this, nonce[identityOwner(nft_contract, nft_id)], nft_contract, "revokeAttribute", name, value));
        revokeAttribute(nft_contract, nft_id, checkSignature(nft_contract, nft_id, sigV, sigR, sigS, hash), name, value);
    }

}
