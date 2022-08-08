import jsonwebtoken from 'jsonwebtoken';
import { JwtPayload, JwtSignOptions, Algorithms } from './types';

/**
 * The JWT exposes methods to create/sign, verify, and decode JSON web tokens
 */
export interface IJWT {
  /**
   * Method accepts claim payload and options, and returns a string Promise
   * @param {object} payload
   * @param {object} options
   * @returns {Promise<string>}
   */
  sign(payload: string | JwtPayload, options?: JwtSignOptions): Promise<string>;

  /**
   * Method accepts the token, publicKey of signing entity, as well as options
   * Decoded JWT is returned in the Promise, if the signature is correct, otherwise
   * an error will be thrown
   * @param {string} token
   * @param {string} publicKey
   * @param {object} options
   * @returns {Promise<object>}
   */
  verify(
    token: string,
    publicKey: string,
    options?: { algorithms?: [Algorithms] }
  ): unknown;

  /**
   * Method decodes JWT without checking the signature. This can be useful in cases,
   * where Public Key of the signer is yet to be retrieved using claim data stored in JWT.
   * Decoded JSON web token is returned.
   * @param {string} token
   * @param {object} options
   * @returns {object}
   */
  decode(token: string, options?: jsonwebtoken.DecodeOptions): unknown;
}
