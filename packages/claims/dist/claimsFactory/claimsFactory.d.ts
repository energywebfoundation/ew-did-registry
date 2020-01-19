import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver';
import { IClaimsFactory, IClaimsUser, IClaimsIssuer, IClaimsVerifier } from '../interface';
/**
 * An implementation of claims factory
 * @class
 */
export declare class ClaimsFactory implements IClaimsFactory {
    private _keys;
    private _resolver;
    constructor(keys: IKeys, resolver: IResolver);
    /**
     * Constructs instance of ClaimsUser
     *
     * @returns { IClaimsUser }
     */
    createClaimsUser(): IClaimsUser;
    /**
     * Contstructs instance of ClaimsIssuer
     *
     * @returns { IClaimsIssuer }
     */
    createClaimsIssuer(): IClaimsIssuer;
    /**
     * Constructs instance of ClaimsUser
     *
     * @returns { IClaimsVerifier }
     */
    createClaimsVerifier(): IClaimsVerifier;
}
