import { IDIDDocument } from '@ew-did-registry/did-resolver-interface';
import { IClaims, IProofData, IPublicClaim, ISaltedFields } from './models';

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
  createPrivateClaim(
    privateData: { [key: string]: string },
    issuer: string
  ): Promise<{ token: string; saltedFields: { [key: string]: string } }>;
  createProofClaim(claimUrl: string, saltedFields: IProofData): Promise<string>;
  verifyClaimContent(token: string, verifyData: object): void;
  verifyPrivateClaim(
    privateToken: string,
    saltedFields: ISaltedFields
  ): Promise<boolean>;
  publishPublicClaim(
    issued: string,
    verifyData: object,
    opts?: { hashAlg: string; createHash: (data: string) => string }
  ): Promise<string>;
  publishPrivateClaim(
    issued: string,
    saltedFields: ISaltedFields,
    opts?: { hashAlg: string; createHash: (data: string) => string }
  ): Promise<string>;
}

export interface IClaimsIssuer extends IClaims {
  issuePublicClaim(
    token: string | IPublicClaim,
  ): Promise<string>;
  issuePrivateClaim(token: string): Promise<string>;
}

export interface IClaimsVerifier extends IClaims {
  verifyPublicProof(
    claimUrl: string,
    {
      holderDoc,
      issuerDoc,
    }?: {
      holderDoc?: IDIDDocument;
      issuerDoc?: IDIDDocument;
    }
  ): Promise<IPublicClaim>;
  verifyPrivateProof(proofToken: string): Promise<void>;
}
