import {
  IClaimData, IClaims, IProofData, ISaltedFields,
} from './models';

/**
 * IClaims interface is a factory to create Public, Private, and Proof Claims
 */
export interface IClaimsFactory {
  createClaimsUser(): IClaimsUser;
  createClaimsIssuer(): IClaimsIssuer;
  createClaimsVerifier(): IClaimsVerifier;
}

export interface IClaimsUser extends IClaims {
  createPublicClaim(publicData: IClaimData): Promise<string>;
  createPrivateClaim(privateData: IClaimData, issuer: string):
    Promise<{ token: string; saltedFields: { [key: string]: string } }>;
  createProofClaim(claimUrl: string, saltedFields: IProofData): Promise<string>;
  verifyPublicClaim(token: string, verifyData: IClaimData): Promise<void>;
  verifyPrivateClaim(privateToken: string, saltedFields: ISaltedFields): Promise<void>;
}

export interface IClaimsIssuer extends IClaims {
  issuePublicClaim(token: string): Promise<string>;
  issuePrivateClaim(token: string): Promise<string>;
}

export interface IClaimsVerifier extends IClaims {
  verifyPublicProof(token: string): Promise<void>;
  verifyPrivateProof(proofToken: string, privateToken: string): Promise<void>;
}
