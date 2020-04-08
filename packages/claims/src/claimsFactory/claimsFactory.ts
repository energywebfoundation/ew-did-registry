import { IKeys } from '@ew-did-registry/keys';
import { IResolver } from '@ew-did-registry/did-resolver-interface';
import {
  IClaimsFactory, IClaimsUser, IClaimsIssuer, IClaimsVerifier,
} from '../interface';
import { ClaimsUser } from '../claimsUser';
import { ClaimsIssuer } from '../claimsIssuer';
import { ClaimsVerifier } from '../claimsVerifier';

/**
 * An implementation of claims factory
 * @class
 */
export class ClaimsFactory implements IClaimsFactory {
  private _keys: IKeys;

  private _resolver: IResolver;

  constructor(keys: IKeys, resolver: IResolver) {
    this._keys = keys;
    this._resolver = resolver;
  }

  /**
   * Constructs instance of ClaimsUser
   *
   * @returns { IClaimsUser }
   */
  createClaimsUser(): IClaimsUser {
    return new ClaimsUser(this._keys, this._resolver);
  }

  /**
   * Contstructs instance of ClaimsIssuer
   *
   * @returns { IClaimsIssuer }
   */
  createClaimsIssuer(): IClaimsIssuer {
    return new ClaimsIssuer(this._keys, this._resolver);
  }

  /**
   * Constructs instance of ClaimsUser
   *
   * @returns { IClaimsVerifier }
   */
  createClaimsVerifier(): IClaimsVerifier {
    return new ClaimsVerifier(this._keys, this._resolver);
  }
}
