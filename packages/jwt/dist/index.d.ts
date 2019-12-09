import { IKeys } from '@ew-did-registry/keys';
import { IJWT } from './interface';
declare class JWT implements IJWT {
    private readonly keyPair;
    private keyEncoder;
    /**
     * Key pair has to be passed on construction to JWT
     * @param {Keys} keyPair
     */
    constructor(keyPair: IKeys);
    /**
     * Sign payload and return JWT
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     *
     * const keyPair = Keys.generateKeyPair();
     * const jwt = new JWT(keyPair);
     * const payload = {claim: 'test'};
     * let token;
     *
     * try {
     *   token = await jwt.sign(payload, { algorithm: 'ES256' });
     *   console.log(token);
     * } catch(e) {
     *   console.log(e);
     * }
     * ```
     *
     * @param {object} payload
     * @param {object} options
     * @returns {Promise<string>}
     */
    sign(payload: object, options?: object): Promise<string>;
    /**
     * If the signature is correct, method returns decoded JWT payload
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     *
     * const AliceKeyPair = Keys.generateKeyPair();
     * const BobKeyPair = Keys.generateKeyPair();
     * const jwtAlice = new JWT(AliceKeyPair);
     * const jwtBob = new JWT(BobKeyPair);
     * const payload = {claim: 'test'};
     *
     * const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });
     *
     * let decoded;
     *
     * try {
     *   decoded = await jwtBob.verify(token, AliceKeyPair.publicKey);
     *   console.log(decoded);
     * } catch(e) {
     *   console.log(e);
     * }
     * ```
     *
     * @param {string} token
     * @param {string} publicKey
     * @param {object} options
     * @returns {Promise<object>}
     */
    verify(token: string, publicKey: string, options?: object): Promise<object>;
    /**
     * Return decoded JWT payload without verifying signature
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     *
     * const AliceKeyPair = Keys.generateKeyPair();
     * const BobKeyPair = Keys.generateKeyPair();
     * const jwtAlice = new JWT(AliceKeyPair);
     * const jwtBob = new JWT(jwtBob);
     * const payload = {claim: 'test'};
     *
     * const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });
     *
     * const decoded = jwtBob.decode(token, {complete: true});
     * console.log(decoded.header);
     * console.log(decoded.payload.did);
     * ```
     *
     * @param {string} token
     * @param {object} options
     * @returns string | { [key: string]: any }
     */
    decode(token: string, options?: object): string | {
        [key: string]: any;
    };
}
export { JWT, IJWT, };
