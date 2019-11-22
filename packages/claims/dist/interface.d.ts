import { IClaim } from './public';
import { IPrivateClaim } from './private';
import { IProofClaim } from './proof';
import { ClaimType, IClaimData } from './models';
export interface IClaims {
    /** private members:
     *   didDocument: IDidDocument
     *   keyPair: IKeyPair;
     */
    createPublicClaim(data: IClaimData): IClaim;
    createPrivateClaim(data: IClaimData, didIssuer: string): IPrivateClaim;
    createProofClaim(data: IClaimData, hashedFields: number[]): IProofClaim;
    generateClaimFromToken(token: string, type: ClaimType): IClaim;
}
