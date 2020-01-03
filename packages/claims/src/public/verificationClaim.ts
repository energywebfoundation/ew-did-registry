import Claim from './claim';
import { IVerificationClaim } from '../models';

class VerificationClaim extends Claim implements IVerificationClaim {
  async verify(): Promise<boolean> {
    await this.getDid();
    const publicKey = this.didDocument.publicKey.find((pk) => pk.type === 'Secp256k1VerificationKey');
    try {
      this.jwt.verify(this.token, publicKey.ethereumAddress.slice(2));
    } catch (error) {
      throw (new Error(error));
    }
    return true;
  }

  async approve(): Promise<string> {
    const decodedPayload = this.jwt.decode(this.token);
    let signedToken;
    try {
      signedToken = await this.jwt.sign(decodedPayload, { algorithm: 'ES256', noTimestamp: true });
    } catch (error) {
      throw (new Error(error));
    }

    return signedToken;
  }
}

export default VerificationClaim;
