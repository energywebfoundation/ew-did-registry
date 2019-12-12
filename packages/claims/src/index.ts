import { IKeys } from '@ew-did-registry/keys';
// import { IDidDocument } from '@ew-did-registry/did-resolver';
import { JWT } from '@ew-did-registry/jwt';
import { IClaims } from './interface';
import { IPrivateClaim, PrivateClaim } from './private';
import { ClaimType, IClaimData, IVerificationClaim } from './models';
import { IProofClaim, ProofClaim } from './proof';
import { VerificationClaim } from './public';

class Claims implements IClaims {
  // private _didDocument: IDidDocument;

  private _keyPair: IKeys;

  constructor(keyPair: IKeys/*, didDocument: IDidDocument*/) {
    this._keyPair = keyPair;
    // this._didDocument = didDocument;
  }

  async createPublicClaim(claimData: IClaimData): Promise<IVerificationClaim> {
    const jwt = new JWT(this._keyPair);
    const token = await jwt.sign(claimData);
    return new VerificationClaim({
      jwt,
      keyPair: this._keyPair,
      token,
    });
  }

  async createPrivateClaim(claimData: IClaimData, didIssuer: string): Promise<IPrivateClaim> {
    const jwt = new JWT(this._keyPair);
    const token = await jwt.sign(claimData);
    return new PrivateClaim({
      jwt,
      keyPair: this._keyPair,
      token,
      issuerDid: didIssuer,
    });
  }

  async createProofClaim(claimData: IClaimData, hashedFields: number[]): Promise<IProofClaim> {
    const jwt = new JWT(this._keyPair);
    const token = await jwt.sign(claimData);
    return new ProofClaim({
      jwt,
      keyPair: this._keyPair,
      token,
      hashedFields,
    });
  }

  async generateClaimFromToken(token: string, type: ClaimType):
      Promise<IVerificationClaim | IPrivateClaim | IProofClaim> {
    const jwt = new JWT(this._keyPair);
    // @ts-ignore
    const { claimData, hashedFields, didIssuer } = await jwt.verify(token, this._keyPair.publicKey);
    switch (type) {
      case ClaimType.Public:
        return await this.createPublicClaim(claimData);
      case ClaimType.Private:
        return await this.createPrivateClaim(claimData, hashedFields);
      case ClaimType.Proof:
        return await this.createProofClaim(claimData, didIssuer);
      default:
        return await this.createPublicClaim(claimData);
    }
  }
}

export {
  IClaims,
  Claims,
};
