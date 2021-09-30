// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
    
contract RevocationRegistry {
    
    struct RevokedClaim {
        address revoker;
        uint revokedTimestamp;
    }
    mapping (bytes32 => mapping(address => RevokedClaim)) revokedClaims;
 
    function revokeClaim(bytes32 role, address subject) public  { 
        require(revokedClaims[role][subject].revokedTimestamp == 0, "The claim is already revoked");
        revokedClaims[role][subject].revoker = msg.sender;
        revokedClaims[role][subject].revokedTimestamp = block.number;
        emit Revoked(msg.sender, role, subject);
    }
 
    function isRevoked(bytes32 role, address subject) public view returns (bool) { 
        if (revokedClaims[role][subject].revokedTimestamp == 0) { 
            return false;
        }
        else { 
            return true; 
        }
    }

    function getRevocationDetail(bytes32 role, address subject) public view returns (address, uint) { 
        return (revokedClaims[role][subject].revoker, revokedClaims[role][subject].revokedTimestamp);
    }

    event Revoked(address revoker, bytes32 role, address subject);
}