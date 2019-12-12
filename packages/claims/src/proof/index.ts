import { IProofClaim } from './interface';
import { Claim, VerificationClaim } from '../public';
import { IProofClaimBuildData, IVerificationClaim } from '../models';

class ProofClaim extends Claim implements IProofClaim {
    private _hashedFields: number[]

    constructor(data: IProofClaimBuildData) {
      super({
        jwt: data.jwt,
        keyPair: data.keyPair,
        token: data.token,
        claimData: data.claimData,
      });
      this._hashedFields = data.hashedFields;
    }

    verify(privateToken: string): boolean {
      return false;
    }
}

export { IProofClaim, ProofClaim };
