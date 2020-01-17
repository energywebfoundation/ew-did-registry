import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver';
import { IClaimsFactory, IClaimsUser, IClaimsIssuer, IClaimsVerifier } from '../interface';
/**
 * An implementation of claim factory
 * @class
 */
export declare class ClaimsFactory implements IClaimsFactory {
    private _keys;
    private _resolver;
    constructor(keys: IKeys, resolver: IResolver);
    createClaimsUser(): IClaimsUser;
    createClaimsIssuer(): IClaimsIssuer;
    createClaimsVerifier(): IClaimsVerifier;
}
