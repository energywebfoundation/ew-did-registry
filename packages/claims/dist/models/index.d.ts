import { IKeys } from '@ew-did-registry/keys';
export interface IClaim {
    did: string;
    signer: string;
    claimData: {
        [key: string]: string | object;
    };
    [key: string]: string | object;
}
export interface IProofClaim extends IClaim {
    claimUrl: string;
}
export interface IClaimData {
    [key: string]: object | string;
}
export interface IClaims {
    did: string;
    keys: IKeys;
}
