import { IPrivateClaim } from './interface';
import { VerificationClaim } from '../public';
import { IPrivateClaimBuildData } from '../models';

export class PrivateClaim extends VerificationClaim implements IPrivateClaim {
    private _issuerDid: string;

    constructor(data: IPrivateClaimBuildData) {
      super({
        jwt: data.jwt,
        keyPair: data.keyPair,
        token: data.token,
        claimData: data.claimData,
      });
      this._issuerDid = data.issuerDid;
    }

    verifyPayload(hashedFields: number[]): boolean {
      return false;
    }
}

export { IPrivateClaim };
