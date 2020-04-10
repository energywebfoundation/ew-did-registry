import { IKeys } from '@ew-did-registry/keys';
import { IJWT } from '@ew-did-registry/jwt';

export interface IPublicClaim {
  did: string;
  signer: string;
  claimData: object;
  [key: string]: string | object;
}

export interface IPrivateClaim {
  did: string;
  signer: string;
  claimData: { [key: string]: string }; // so that they can be salted
  [key: string]: string | object;
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

export interface IProofData {
  [key: string]: {
    value: string | object; // string - for non-encrypted, {h,s} - for encrypted
    encrypted: boolean;
  };
}

export interface IClaims {
  did: string;
  keys: IKeys;
  jwt: IJWT;
  verify(
    claimUrl: string, hashFns?: { [hashAlg: string]: (data: string) => string },
  ): Promise<IPublicClaim | IPrivateClaim>;
}
