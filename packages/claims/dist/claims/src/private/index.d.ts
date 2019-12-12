import { IPrivateClaim } from './interface';
import { VerificationClaim } from '../public';
import { IPrivateClaimBuildData } from '../models';
export declare class PrivateClaim extends VerificationClaim implements IPrivateClaim {
    private _issuerDid;
    constructor(data: IPrivateClaimBuildData);
    verifyPayload(hashedFields: number[]): boolean;
}
export { IPrivateClaim };
