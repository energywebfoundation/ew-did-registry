import { IDIDDocumentFull } from '@ew-did-registry/did-document';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import { DelegateTypes, IPublicKey, IdentityOwner } from '@ew-did-registry/did-resolver-interface';
import { IClaims } from '../models';
import { hashes } from '../utils';

/**
 * @class
 * Base class for extending by other claims classes
 */
export class Claims implements IClaims {
  public jwt: IJWT;

  public keys: {
    privateKey?: string;
    publicKey: string;
  };

  public owner: IdentityOwner;

  public did: string;

  /**
   * @constructor
   *
   * @param { IKeys } keys
   * @param document
   * @param store
   */
  constructor(
    owner: IdentityOwner,
    protected document: IDIDDocumentFull,
    protected store: IDidStore,
  ) {
    this.keys = { publicKey: owner.publicKey, privateKey: owner.privateKey };
    this.jwt = new JWT(owner);
    this.did = document.did;
  }

  /**
   * Verifies signers signature on received token
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { Claims } from '@ew-did-registry/claims';
   *
   * const user = new Keys();
   * const claims = new Claims(user);
   * const verified = claims.verifySignature(token, userDid);
   * ```
   *
   * @param { string } token token signature on which you want to check
   * @param { string } signer did of the signer
   */
  async verifySignature(token: string, signer: string): Promise<boolean> {
    const signerPubKey = await this.document.ownerPubKey(signer);
    try {
      await this.jwt.verify(token, signerPubKey);
    } catch (error) {
      return false;
    }
    return true;
  }

  /**
   * Verifies integrity of the claim, the claim is issued by the user
   *  delegate and the authenticity of the issuer's signature
   *
   * @param claimUrl {string}
   * @param hashFns {{ [alg: string]: (data: string) => string }}
   */
  async verify(
    claimUrl: string, hashFns?: { [alg: string]: (data: string) => string },
  ): Promise<any> {
    const token = await this.store.get(claimUrl);
    const claim: any = this.jwt.decode(token);
    if (!(await this.verifySignature(token, claim.iss))) {
      throw new Error('Invalid signature');
    }
    if (!this.document.isValidDelegate(DelegateTypes.verification, claim.signer, claim.did)) {
      throw new Error('Issuer isn\'t a use\'r delegate');
    }
    const service = await this.document.readAttribute(
      { service: { serviceEndpoint: claimUrl } }, (claim).sub,
    );
    const { hash, hashAlg } = service;
    const createHash = { ...hashes, ...hashFns }[hashAlg as string];
    if (hash !== createHash(token)) {
      throw new Error('Claim was changed');
    }
    return claim;
  }
}
