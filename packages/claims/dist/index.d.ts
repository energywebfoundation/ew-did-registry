import { IKeys } from '@ew-did-registry/keys';
import { IClaims } from './interface';
import { IPrivateClaim } from './private';
import { ClaimType, IClaimData, IVerificationClaim } from './models';
import { IProofClaim } from './proof';
declare class Claims implements IClaims {
    private _keyPair;
    constructor(keyPair: IKeys);
    createPublicClaim(claimData: IClaimData): Promise<IVerificationClaim>;
    createPrivateClaim(claimData: IClaimData, didIssuer: string): Promise<IPrivateClaim>;
    createProofClaim(claimData: IClaimData, hashedFields: number[]): Promise<IProofClaim>;
    generateClaimFromToken(token: string, type: ClaimType): Promise<IVerificationClaim | IPrivateClaim | IProofClaim>;
}
export { IClaims, Claims, };
