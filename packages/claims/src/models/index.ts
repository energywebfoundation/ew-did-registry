export enum ClaimType {
    Public,
    Private,
    Proof
}

export interface IClaimData {
    did: string;
    [key: string]: string;
}
