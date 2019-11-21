export declare enum ClaimType {
    Public = 0,
    Private = 1,
    Proof = 2
}
export interface IClaimData {
    did: string;
    [key: string]: string;
}
