import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver';
import {
  IClaimsFactory, IClaimsUser, IClaimsIssuer, IClaimsVerifier,
} from '../interface';
import ClaimsUser from '../claimsUser/claimsUser';
import { ClaimsIssuer } from '../claimsIssuer';
import { ClaimsVerifier } from '../claimsVerifier';

/**
 * An implementation of claim factory
 * @class
 */
export class ClaimsFactory implements IClaimsFactory {
  private _keys: IKeys;

  private _resolver: IResolver;

  constructor(keys: IKeys, resolver: IResolver) {
    this._keys = keys;
    this._resolver = resolver;
  }

  createClaimsUser(): IClaimsUser {
    return new ClaimsUser(this._keys, this._resolver);
  }

  createClaimsIssuer(): IClaimsIssuer {
    return new ClaimsIssuer(this._keys, this._resolver);
  }

  createClaimsVerifier(): IClaimsVerifier {
    return new ClaimsVerifier(this._keys, this._resolver);
  }
}
