import { IKeys } from '@ew-did-registry/keys';
import { IJWT } from '@ew-did-registry/jwt';
import { IClaimData } from '../models';
export interface IClaim {
    /**
     * To construct the Public Claim IClaimBuildData has to be provided
     * constructor(data: IClaimBuildData);
     */
    /**
     * jwt stores the JWT to manage web tokens
     * claimToken stores the actual serialised JWT in a string format
     * claimData stores the claim fields
     * keyPair represents the implementation of key management interface
     */
    jwt: IJWT;
    claimToken: string;
    claimData: IClaimData;
    keyPair: IKeys;
    /**
     * verify check if the given Claim was signed correctly
     * @returns {boolean}
     */
    verify(): boolean;
    /**
     * Method signs the claim and return the serialised JWT
     * @returns {string}
     */
    approve(): string;
    /**
     * Method returns the DID document associated with a claim subject DID
     * @returns {string}
     */
    getDid(): string;
}
