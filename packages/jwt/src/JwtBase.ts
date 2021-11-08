import jsonwebtoken from 'jsonwebtoken';
import { utils } from 'ethers';
import base64url from 'base64url';
import { pubToPem, KeyType } from '@ew-did-registry/keys';
import { computePublicKey } from 'ethers/lib/utils';
import { JwtVerifyOptions, Algorithms } from './types';
import { JwtVerificationFailed } from './JwtVerificationFailed';

const {
  arrayify, keccak256, hashMessage, recoverPublicKey,
} = utils;

/**
 * @description Any JWT implementation verifies any JWT
 */
export class JwtBase {
  /**
  * If the signature is correct, method returns decoded JWT payload
  *
  * @example
  * ```typescript
  * const issuerKeys = new Keys();
  * const issuer = new JWT(issuerKeys);
  * const verifier = new JWT(new Keys());
  * const payload = {claim: 'test'};
  *
  * const token = await issuer.sign(payload); // signing algorithm is determined by issuer's signer
  * expect(verifier.verify(token), issuerKeys.publicKey, ['ES256K']).to.eql(payload);
  * ```
  * @param {string} token
  * @param {string} publicKey - public key in hexadecimal format in compressed or uncompressed form
  */
  verify(
    token: string,
    publicKey: string,
    { algorithms = [Algorithms.EIP191] }: JwtVerifyOptions = {},
  ): unknown {
    if (algorithms.includes(Algorithms.EIP191)) {
      try {
        return this.verifyEIP191(token, publicKey);
      } catch { }
    }
    if (algorithms.includes(Algorithms.ES256)) {
      try {
        return this.verifyES256(token, publicKey);
      } catch { }
    }
    throw new JwtVerificationFailed();
  }

  /**
  * Return decoded JWT payload without verifying signature
  *
  * @example
  * ```typescript
  * const issuer = new JWT(new Keys());
  * const verifier = new JWT(new Keys());
  * const payload = {claim: 'test'};
  *
  * const token = await issuer.sign(payload, { algorithm: 'ES256K' });
  *
  * expect(verifier.decode(token, {complete: true}).payload).to.eql(payload);
  * ```
  *
  * @param {string} token
  * @param {object} options
  * @returns string | { [key: string]: any }
  */
  decode(token: string, options?: jsonwebtoken.DecodeOptions): unknown {
    return jsonwebtoken.decode(token, options) || '';
  }

  private verifyES256(token: string, pubKey: string): unknown {
    const pemPubKey = pubToPem(pubKey, KeyType.Secp256r1);
    return jsonwebtoken.verify(token, pemPubKey, { algorithms: ['ES256'] });
  }

  private verifyEIP191(token: string, pubKey: string): unknown {
    if (!pubKey.startsWith('0x')) {
      pubKey = `0x${pubKey}`;
    }
    pubKey = computePublicKey(pubKey);

    const possibleKeys = (message: string, signature: string): string[] => [
      arrayify(keccak256(message)),
      arrayify(hashMessage(arrayify(keccak256(message)))),
    ]
      .map((h) => recoverPublicKey(h, signature)); // uncompressed with 0x

    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    const msg = `0x${Buffer.from(`${encodedHeader}.${encodedPayload}`).toString('hex')}`;
    const signature = base64url.decode(encodedSignature);
    const verified = possibleKeys(msg, signature).find((key) => key === pubKey);
    if (verified) {
      return JSON.parse(base64url.decode(encodedPayload));
    }
    throw new Error();
  }
}
