import { IKeys } from '@ew-did-registry/keys';
import { IClaims } from './interface';
import { IPrivateClaim } from './private';
import { ClaimType, IClaimData, IVerificationClaim } from './models';
import { IProofClaim } from './proof';
import { IDIDDocument } from '../../did-resolver/src';
declare class Claims implements IClaims {
    private _didDocument;
    private _keyPair;
    constructor(keyPair: IKeys, didDocument: IDIDDocument);
    createPublicClaim(claimData: IClaimData): IVerificationClaim;
    createPrivateClaim(claimData: IClaimData, didIssuer: string): IPrivateClaim;
    createProofClaim(claimData: IClaimData, hashedFields: number[]): IProofClaim;
    generateClaimFromToken(token: string, type: ClaimType): IVerificationClaim | IPrivateClaim | IProofClaim;
}
export { IClaims, Claims, };
