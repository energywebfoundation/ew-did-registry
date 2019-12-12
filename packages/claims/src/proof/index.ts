/* eslint-disable class-methods-use-this */
import { IProofClaim } from './interface';
import { Claim } from '../public';
import { IProofClaimBuildData } from '../models';

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
