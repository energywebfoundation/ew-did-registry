import { IKeys } from '@ew-did-registry/keys';
import { IClaims } from './interface';
import { IPrivateClaim, PrivateClaim } from './private';
import { ClaimType, IClaimData, IVerificationClaim } from './models';
import { IProofClaim, ProofClaim } from './proof';
import { IDIDDocument } from '../../did-resolver/src';
import VerificationClaim from './public/verificationClaim';

class Claims implements IClaims {
  private _didDocument: IDidDocument;

  private _keyPair: IKeys;

  constructor(keyPair: IKeys, didDocument: IDIDDocument) {
    this._keyPair = keyPair;
    this._didDocument = didDocument;
  }

  createPublicClaim(claimData: IClaimData): IVerificationClaim {
    return new VerificationClaim({
      jwt: null,
      keyPair: this._keyPair,
      claimData,
      token: null,
    });
  }

  createPrivateClaim(claimData: IClaimData, didIssuer: string): IPrivateClaim {
    return new PrivateClaim({
      jwt: null,
      keyPair: this._keyPair,
      token: null,
      claimData,
      issuerDid: didIssuer,
    });
  }

  createProofClaim(claimData: IClaimData, hashedFields: number[]): IProofClaim {
    return new ProofClaim({
      jwt: null,
      keyPair: this._keyPair,
      token: null,
      claimData,
      hashedFields,
    });
  }

  generateClaimFromToken(token: string, type: ClaimType):
      IVerificationClaim | IPrivateClaim | IProofClaim {
    const jwt = null; // JWT.decode(token)
    const { claimData, hashedFields, didIssuer } = jwt;
    switch (type) {
      case ClaimType.Public:
        return this.createPublicClaim(claimData);
      case ClaimType.Private:
        return this.createPrivateClaim(claimData, hashedFields);
      case ClaimType.Proof:
        return this.createProofClaim(claimData, didIssuer);
      default:
        return this.createPublicClaim(claimData);
    }
  }
}

export {
  IClaims,
  Claims,
};
