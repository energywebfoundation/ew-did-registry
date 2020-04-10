import {
  IClaims, IProofData, ISaltedFields, IPublicClaim,
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
  createPublicClaim(publicData: object): Promise<string>;
  createPrivateClaim(privateData: { [key: string]: string }, issuer: string):
    Promise<{ token: string; saltedFields: { [key: string]: string } }>;
  createProofClaim(claimUrl: string, saltedFields: IProofData): Promise<string>;
  verifyPublicClaim(token: string, verifyData: object): Promise<boolean>;
  verifyPrivateClaim(privateToken: string, saltedFields: ISaltedFields): Promise<boolean>;
  publishPublicClaim(issued: string, verifyData: object): Promise<string>;
  publishPrivateClaim(issued: string, saltedFields: ISaltedFields): Promise<string>;
}

export interface IClaimsIssuer extends IClaims {
  issuePublicClaim(token: string): Promise<string>;
  issuePrivateClaim(token: string): Promise<string>;
}

export interface IClaimsVerifier extends IClaims {
  verifyPublicProof(claimUrl: string): Promise<IPublicClaim>;
  verifyPrivateProof(proofToken: string, privateToken: string): Promise<void>;
}
