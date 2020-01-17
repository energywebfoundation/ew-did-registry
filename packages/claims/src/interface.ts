import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver';
import {
  IClaimData,
} from './models';

/**
 * IClaims interface is a factory to create Public, Private, and Proof Claims
 */
export interface IClaimsFactory {
  createClaimsUser(keys: IKeys, resolver: IResolver): IClaimsUser;
  createClaimsIssuer(keys: IKeys, resolver: IResolver): IClaimsIssuer;
  createClaimsVerifier(keys: IKeys, resolver: IResolver): IClaimsVerifier;
}

export interface IClaimsUser {
  createPublicClaim(claimData: IClaimData): Promise<string>;
  createPrivateClaim(claimData: IClaimData, issuer: string):
    Promise<{ token: string; saltedFields: { [key: string]: string } }>;
  createProofClaim(claimUrl: string, saltedFields: { [key: string]: string }): Promise<string>;
  verifyPublicClaim(token: string): Promise<boolean>;
  verifyPrivateClaim(privateToken: string, saltedFields: { [key: string]: string }): Promise<boolean>;
}

export interface IClaimsIssuer {
  issuePublicClaim(token: string): Promise<string>;
  issuePrivateClaim(token: string): Promise<string>;
}

export interface IClaimsVerifier {
  verifyPublicProof(token: string): Promise<boolean>;
  verifyPrivateProof(proofToken: string, privateToken: string): boolean;
}
