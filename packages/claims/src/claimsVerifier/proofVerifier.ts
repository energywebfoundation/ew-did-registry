import { Algorithms, JWT } from '@ew-did-registry/jwt';
import { Keys } from '@ew-did-registry/keys';
import {
  IAuthentication,
  IDIDDocument,
  IPublicKey,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';
import { utils } from 'ethers';
import base64url from 'base64url';

const {
  arrayify, recoverAddress, keccak256, hashMessage,
} = utils;

export class ProofVerifier {
  private _jwt = new JWT(new Keys());

  private _didDocument: IDIDDocument;

  constructor(didDocument: IDIDDocument) {
    this._didDocument = didDocument;
  }

  /**
   * @description checks that token was issued by identity represented by
   * this verifier or his authentication delegate
   *
   * @param token
   *
   * @returns {string} DID of authenticated identity
   */
  public async verifyAuthenticationProof(token: string): Promise<string | null> {
    if (
      (await this.isIdentity(token))
      || (await this.isAuthenticationDelegate(token))
    ) {
      return this._didDocument.id;
    }
    return null;
  }

  /**
   * @description checks that token is issued by identity verification delegate
   *
   * @param token
   * @returns
   */
  public async verifyAssertionProof(token: string): Promise<string | null> {
    if (await this.isVerificationDelegate(token)) {
      return this._didDocument.id;
    }
    return null;
  }

  /**
   * @description Determines if a token was signed with an Ethereum signature
   * by the address referenced by the id of the DID Document
   * Note that JWT-compliant signatures can't be used to recover an ethereum
   */
  private async isIdentity(token: string) {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    const msg = `0x${Buffer.from(`${encodedHeader}.${encodedPayload}`).toString(
      'hex',
    )}`;
    const signature = base64url.decode(encodedSignature);
    const hash = arrayify(keccak256(msg));
    const claimedAddress = this._didDocument.id.split(':')[2];
    try {
      if (claimedAddress === recoverAddress(hash, signature)) {
        return true;
      }
    } catch (_) {}
    const digest = arrayify(hashMessage(hash));
    try {
      if (claimedAddress === recoverAddress(digest, signature)) {
        return true;
      }
    } catch (_) {}
    return false;
  }

  private async isAuthenticationDelegate(token: string) {
    const validKeys = await this.verifySignature(
      this.authenticationKeys(),
      token,
    );
    return validKeys.length !== 0;
  }

  private async isVerificationDelegate(token: string) {
    const validKeys = await this.verifySignature(
      this.verificationKeys(),
      token,
    );
    return validKeys.length !== 0;
  }

  private verifySignature = async (keys: IPublicKey[], token: string) => {
    const results = await Promise.all(
      keys.map(
        async (pubKeyField: IPublicKey): Promise<boolean> => {
          try {
            if (pubKeyField.publicKeyHex) {
              const parts = pubKeyField.publicKeyHex.split('x');
              const publickey = parts.length === 2 ? parts[1] : parts[0];
              const decodedClaim = await this._jwt.verify(token, publickey, {
                algorithms: [Algorithms.ES256, Algorithms.EIP191],
              });

              return decodedClaim !== undefined;
            }
            return false;
          } catch (error) {
            return false;
          }
        },
      ),
    );

    return keys.filter((_key, index) => results[index]);
  };

  private authenticationKeys(): IPublicKey[] {
    const didPubKeys = this._didDocument.publicKey;
    if (didPubKeys.length === 0) {
      return [];
    }
    return didPubKeys.filter(
      (key) =>
        this.isSigAuth(key.type)
        || this._didDocument.authentication.some(
          (auth) =>
            (auth as IAuthentication).publicKey
            && this.areLinked((auth as IAuthentication).publicKey, key.id),
        ),
    );
  }

  private verificationKeys(): IPublicKey[] {
    const didPubKeys = this._didDocument.publicKey;
    if (didPubKeys.length === 0) {
      return [];
    }
    return didPubKeys.filter((key) => this.isVeriKey(key.type));
  }

  // used to check if publicKey field in authentication refers to publicKey ID in publicKey field
  private areLinked = (authId: string, pubKeyID: string) => {
    if (authId === pubKeyID) {
      return true;
    }
    if (authId.includes('#')) {
      return pubKeyID.split('#')[0] === authId.split('#')[0];
    }
    return false;
  };

  private isSigAuth(pubKeyType: string) {
    return pubKeyType.endsWith(PubKeyType.SignatureAuthentication2018);
  }

  private isVeriKey(pubKeyType: string) {
    return pubKeyType.endsWith(PubKeyType.VerificationKey2018);
  }
}
