import { IProofClaim } from './interface';
import { Claim } from '../public';
import { IProofClaimBuildData } from '../models';
declare class ProofClaim extends Claim implements IProofClaim {
    private _hashedFields;
    constructor(data: IProofClaimBuildData);
    verify(privateToken: string): boolean;
}
export { IProofClaim, ProofClaim };
