import { IClaimData, IClaims } from './models';
/**
 * IClaims interface is a factory to create Public, Private, and Proof Claims
 */
export interface IClaimsFactory {
    createClaimsUser(): IClaimsUser;
    createClaimsIssuer(): IClaimsIssuer;
    createClaimsVerifier(): IClaimsVerifier;
}
export interface IClaimsUser extends IClaims {
    createPublicClaim(claimData: IClaimData): Promise<string>;
    createPrivateClaim(claimData: IClaimData, issuer: string): Promise<{
        token: string;
        saltedFields: {
            [key: string]: string;
        };
    }>;
    createProofClaim(claimUrl: string, saltedFields: {
        [key: string]: string;
    }): Promise<string>;
    verifyPublicClaim(token: string): Promise<boolean>;
    verifyPrivateClaim(privateToken: string, saltedFields: {
        [key: string]: string;
    }): Promise<boolean>;
}
export interface IClaimsIssuer extends IClaims {
    issuePublicClaim(token: string): Promise<string>;
    issuePrivateClaim(token: string): Promise<string>;
}
export interface IClaimsVerifier extends IClaims {
    verifyPublicProof(token: string): Promise<boolean>;
    verifyPrivateProof(proofToken: string, privateToken: string): Promise<boolean>;
}
