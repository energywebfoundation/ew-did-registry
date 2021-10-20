pragma solidity >=0.7.0 <0.9.0;

/**
* A contract for tracking the revocations of off-chain verifiable credentials.
* For on-chain role revocations, see contract in iam-contracts repository.
*/  
contract RevocationRegistry {
    
    struct RevokedClaim {
        address revoker;
        uint revokedTimestamp;
    }
    mapping (bytes32 => RevokedClaim[]) revokedClaims;
 
    function revokeClaim(bytes32 credential) public  {
        revokedClaims[credential].push( RevokedClaim(msg.sender, block.number));
        emit Revoked(msg.sender, credential);
    }

    function getRevocations(bytes32 credential) public view returns (address[] memory, uint[] memory) { 
        address[] memory revokers = new address[](revokedClaims[credential].length);
        uint[] memory revokedTimestamp = new uint[](revokedClaims[credential].length);
        for (uint i = 0; i < revokedClaims[credential].length; i++) {
                revokers[i] = revokedClaims[credential][i].revoker;
                revokedTimestamp[i] = revokedClaims[credential][i].revokedTimestamp;
            }
        return (revokers, revokedTimestamp);
    }

    event Revoked(address revoker, bytes32 role);
}