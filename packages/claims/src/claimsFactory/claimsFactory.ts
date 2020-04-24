import { IKeys } from '@ew-did-registry/keys';
import { IDIDDocumentFull } from '@ew-did-registry/did-document';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import {
  IClaimsFactory, IClaimsIssuer, IClaimsUser, IClaimsVerifier,
} from '../interface';
import { ClaimsUser } from '../claimsUser';
import { ClaimsIssuer } from '../claimsIssuer';
import { ClaimsVerifier } from '../claimsVerifier';

/**
 * An implementation of claims factory
 * @class
 */
export class ClaimsFactory implements IClaimsFactory {
  // eslint-disable-next-line no-useless-constructor
  constructor(private keys: IKeys, private document: IDIDDocumentFull, private store: IDidStore) { }

  /**
   * Constructs instance of ClaimsUser
   *
   * @returns { IClaimsUser }
   */
  createClaimsUser(): IClaimsUser {
    return new ClaimsUser(this.keys, this.document, this.store);
  }

  /**
   * Contstructs instance of ClaimsIssuer
   *
   * @returns { IClaimsIssuer }
   */
  createClaimsIssuer(): IClaimsIssuer {
    return new ClaimsIssuer(this.keys, this.document, this.store);
  }

  /**
   * Constructs instance of ClaimsUser
   *
   * @returns { IClaimsVerifier }
   */
  createClaimsVerifier(): IClaimsVerifier {
    return new ClaimsVerifier(this.keys, this.document, this.store);
  }
}
