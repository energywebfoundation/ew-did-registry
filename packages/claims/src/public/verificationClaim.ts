import { IKeys } from '@ew-did-registry/keys';
import Claim from './claim';
import { IClaimBuildData, IVerificationClaim } from '../models';

class VerificationClaim extends Claim implements IVerificationClaim {
    private readonly _keys: IKeys;

    /**
     * Key pair has to be passed on construction to Verification Claim
     * @param {Keys} keys
     */
    constructor(data: IClaimBuildData, keys: IKeys) {
      super(data);
      this._keys = keys;
    }

    verify(): boolean {
      const publicKey = this.didDocument.publicKey.find((pk) => pk.type === 'Secp256k1VerificationKey');
      try {
        this.jwt.verify(this.token, publicKey.ethereumAddress);
      } catch (error) {
        throw (new Error(error));
      }
      return true;
    }

    async approve(): Promise<string> {
      const decodedPayload = this.jwt.decode(this.token);
      let signedToken;
      try {
        signedToken = await this.jwt.sign(decodedPayload);
      } catch (error) {
        throw (new Error(error));
      }

      return signedToken;
    }
}

export default VerificationClaim;
