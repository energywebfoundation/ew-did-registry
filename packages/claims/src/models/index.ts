import { IJWT } from '@ew-did-registry/jwt';
import { StatusList2021Entry } from '@ew-did-registry/credentials-interface';

export interface IPublicClaim{
  did: string;
  signer: string;
  claimData: object;
  credentialStatus?: StatusList2021Entry;
  [key: string]: string | object | undefined;
}

export interface IPrivateClaim {
  did: string;
  signer: string;
  claimData: { [key: string]: string | [] }; // so that they can be salted
  [key: string]: string | object;
}

export interface IProofData {
  [key: string]: {
    value: string | object; // string - for non-encrypted, {h,s} - for encrypted
    encrypted: boolean;
  };
}

export interface IProofClaim {
  did: string;
  signer: string;
  claimUrl: string;
  proofData: IProofData;
  [key: string]: string | object;
}

export interface ISaltedFields {
  [key: string]: string;
}

export interface IClaims {
  did: string;
  keys: {
    privateKey?: string;
    publicKey: string;
  };
  jwt: IJWT;
  verify(
    claimUrl: string,
    hashFns?: { [hashAlg: string]: (data: string) => string }
  ): Promise<IPublicClaim | IPrivateClaim>;
}

export enum VerificationPurpose {
  Authentication = 'Authentication',
  Assertion = 'Assertion',
}
