import { IKeys } from '@ew-did-registry/keys';
import { IJWT } from '@ew-did-registry/jwt';

export interface IClaim {
    did: string;
    signer: string;
    claimData: IClaimData;
    [key: string]: string | object;
}

export interface IProofClaim extends IClaim {
    claimUrl: string;
}

export interface IClaimData {
    [key: string]: object | string;
}

export interface ISaltedFields {
    [key: string]: string;
}

export interface IProofData {
    [key: string]: {
        value: string;
        encrypted: boolean;
    };
}

export interface IClaims {
    did: string;
    keys: IKeys;
    jwt: IJWT;
}
