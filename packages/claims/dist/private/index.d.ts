import { IPrivateClaim } from './interface';
import { VerificationClaim } from '../public';
import { IPrivateClaimBuildData } from '../models';
declare class PrivateClaim extends VerificationClaim implements IPrivateClaim {
    issuerDid: string;
    private resolverSettings;
    /**
     * Constructor takes as input Private Claim data.
     * eslint warning disabled to ensure type-checking.
     * @param data
     */
    constructor(data: IPrivateClaimBuildData);
    createPrivateClaimData(): Promise<{
        [key: string]: string;
    }>;
    decryptAndHashFields(privateKey: string): void;
    verifyPayload(saltedFields: {
        [key: string]: string;
    }): boolean;
}
export { IPrivateClaim, PrivateClaim };
