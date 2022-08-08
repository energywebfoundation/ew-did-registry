pragma solidity >=0.7.0 <0.9.0;

/**
* A contract for tracking the revocations of off-chain verifiable credentials.
* For on-chain role revocations, see contract in ew-credentials repository.
* (https://github.com/energywebfoundation/ew-credentials/tree/develop/packages/onchain-claims/contracts)
*/  
contract CredentialRevocationRegistry {
    
    struct RevokedCredential {
        address revoker;
        uint revokedTimestamp;
    }
    mapping (bytes32 => RevokedCredential[]) revokedCredentials;
 
    function revokeCredential(bytes32 credential) public  {
        revokedCredentials[credential].push( RevokedCredential(msg.sender, block.number));
        emit Revoked(msg.sender, credential);
    }

    function getRevocations(bytes32 credential) public view returns (address[] memory, uint[] memory) { 
        address[] memory revokers = new address[](revokedCredentials[credential].length);
        uint[] memory revokedTimestamp = new uint[](revokedCredentials[credential].length);
        for (uint i = 0; i < revokedCredentials[credential].length; i++) {
                revokers[i] = revokedCredentials[credential][i].revoker;
                revokedTimestamp[i] = revokedCredentials[credential][i].revokedTimestamp;
            }
        return (revokers, revokedTimestamp);
    }

    event Revoked(address revoker, bytes32 credential);
}