import { IKeys } from '@ew-did-registry/keys';
import { IJWT } from '@ew-did-registry/jwt';
import { IResolverSettings } from '@ew-did-registry/did-resolver';
/**
 * This enumerated type specifies available Claim Types
 */
export declare enum ClaimType {
    Public = 0,
    Private = 1,
    Proof = 2
}
/**
 * Claim Data interface specifies the format of claim data fields
 * DID is a required property for every Claim
 */
export interface IClaimData {
    did: string;
    [key: string]: string;
}
/**
 * Claim Build Data outlines the necessary properties used to create
 * each of the Claim types
 */
export interface IClaimBuildData {
    jwt: IJWT;
    keyPair: IKeys;
    token?: string;
    claimData?: IClaimData;
    resolverSettings?: IResolverSettings;
}
/**
 * Claim interface is used by all Claim types
 */
export interface IClaim {
    /**
     * To construct the Public Claim IClaimBuildData has to be provided
     * constructor(data: IClaimBuildData);
     */
    /**
     * jwt stores the JWT to manage web tokens
     */
    jwt: IJWT;
    /**
     * claimToken stores the actual serialised JWT in a string format
     */
    token: string;
    /**
     * claimData stores the claim fields
     */
    claimData: IClaimData;
    /**
     * keyPair represents the implementation of key management interface
     */
    keyPair: IKeys;
    /**
     * Method returns the DID document associated with a claim subject DID
     * @returns {string}
     */
    getDid(): Promise<boolean>;
}
/**
 * Verification Claim interface specifies methods to verify and approve claims
 * and is used by Private and Public Claims
 */
export interface IVerificationClaim extends IClaim {
    /**
     * verify check if the given Claim was signed correctly
     * @returns {boolean}
     */
    verify(): Promise<boolean>;
    /**
     * Method signs the claim and return the serialised JWT
     * @returns {string}
     */
    approve(): Promise<string>;
}
/**
 * Private Claim Build Data extends the general Claim Build Data
 * interface and is required to construct Private Claims
 */
export interface IPrivateClaimBuildData extends IClaimBuildData {
    issuerDid?: string;
}
/**
 * Proof Claim Build Data extends the general Claim Build Data
 * interface and is required to construct Proof Claims
 */
export interface IProofClaimBuildData extends IClaimBuildData {
    hashedFields?: number[];
}
