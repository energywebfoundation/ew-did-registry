import { IDIDDocumentFull } from '@ew-did-registry/did-document';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import { IdentityOwner } from '@ew-did-registry/did-resolver-interface';
import { signerFromKeys, walletPubKey, Web3Signer } from '@ew-did-registry/did-ethr-resolver';
import { IKeys } from '@ew-did-registry/keys';
import {
  IClaimsFactory, IClaimsIssuer, IClaimsUser, IClaimsVerifier,
} from '../interface';
import { ClaimsUser } from '../claimsUser';
import { ClaimsIssuer } from '../claimsIssuer';
import { ClaimsVerifier } from '../claimsVerifier';
import { Signer } from 'ethers';

/**
 * An implementation of claims factory
 * @class
 */
export class ClaimsFactory implements IClaimsFactory {
  private owner: Signer;

  // eslint-disable-next-line no-useless-constructor
  constructor(private keys: IKeys, private document: IDIDDocumentFull, private store: IDidStore) {
    this.owner = Web3Signer.fromPrivateKey(keys.privateKey);
  }

  /**
   * Constructs instance of ClaimsUser
   *
   * @returns { IClaimsUser }
   */
  createClaimsUser(): IClaimsUser {
    return new ClaimsUser(this.owner, this.document, this.store);
  }

  /**
   * Contstructs instance of ClaimsIssuer
   *
   * @returns { IClaimsIssuer }
   */
  createClaimsIssuer(): IClaimsIssuer {
    return new ClaimsIssuer(this.owner, this.document, this.store);
  }

  /**
   * Constructs instance of ClaimsUser
   *
   * @returns { IClaimsVerifier }
   */
  createClaimsVerifier(): IClaimsVerifier {
    return new ClaimsVerifier(this.owner, this.document, this.store);
  }
}
