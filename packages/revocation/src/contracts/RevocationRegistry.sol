// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
    
contract RevocationRegistry {
    
    struct RevokedClaim {
        address revoker;
        uint revokedTimestamp;
    }
    mapping (bytes32 => RevokedClaim) revokedClaims;
 
    function revokeClaim(bytes32 claimDigest) public  { 
        require(revokedClaims[claimDigest].revokedTimestamp == 0, "The claim is already revoked");
        revokedClaims[claimDigest].revoker = msg.sender;
        revokedClaims[claimDigest].revokedTimestamp = block.number;
        emit Revoked(msg.sender, claimDigest);
    }
 
    function isRevoked(bytes32 claimDigest) public view returns (bool) { 
        if (revokedClaims[claimDigest].revokedTimestamp == 0) { 
            return false;
        }
        else { 
            return true; 
        }
    }

    function getRevoker(bytes32 claimDigest) public view returns (address) { 
        return revokedClaims[claimDigest].revoker;
    }
    event Revoked(address revoker, bytes32 claimDigest);
}