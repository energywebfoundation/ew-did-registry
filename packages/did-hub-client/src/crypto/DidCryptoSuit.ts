import {
  Secp256k1CryptoSuite, Encrypter, EcPrivateKey, PublicKey, PrivateKey, CryptoSuite, Signer,
} from '@decentralized-identity/did-auth-jose';
import { encrypt, decrypt } from 'eciesjs';
import EcKey from 'ec-key';
import EcPublicKey from '@decentralized-identity/did-auth-jose/dist/lib/crypto/ec/EcPublicKey';
import { IDidDocumentPublicKey } from '@decentralized-identity/did-common-typescript';
import { PublicKeyConstructors } from '@decentralized-identity/did-auth-jose/dist/lib/interfaces/CryptoSuite';
import { DidPublicKey } from './DidPublicKey';

export class DidCryptoSuite implements CryptoSuite {

  getEncrypters(): { [algorithm: string]: Encrypter } {
    return {
      ECIES: {
        encrypt: DidCryptoSuite.encryptECIES,
        decrypt: DidCryptoSuite.decryptECIES,
      },
    };
  }

  getSigners(): { [algorithm: string]: Signer } {
    return {
      ES256K: {
        sign: Secp256k1CryptoSuite.sign,
        verify: Secp256k1CryptoSuite.verify,
      },
    };
  }

  getKeyConstructors(): PublicKeyConstructors {
    return {
      Secp256k1VerificationKey2018: (keyData: IDidDocumentPublicKey): PublicKey => new DidPublicKey(keyData),
      EdDsaSAPublicKeySecp256k1: (keyData: IDidDocumentPublicKey): PublicKey => new DidPublicKey(keyData),
      EdDsaSASignatureSecp256k1: (keyData: IDidDocumentPublicKey): PublicKey => new DidPublicKey(keyData),
      EcdsaPublicKeySecp256k1: (keyData: IDidDocumentPublicKey): PublicKey => new DidPublicKey(keyData),
    };
  }

  /**
   * Verifies the given signed content using SHA256 algorithm.
   *
   * @returns true if passed signature verification, false otherwise.
   */
  public static async verify(
    signedContent: string,
    signature: string,
    jwk: PublicKey,
  ): Promise<boolean> {
    const publicKey = new EcKey(jwk);
    const passedVerification: boolean = publicKey.createVerify('SHA256')
      .update(signedContent)
      .verify(signature, 'base64');

    return passedVerification;
  }

  /**
   * Sign the given content using the given private key in JWK format using algorithm SHA256.
   *
   * @param jwsHeaderParameters Header parameters in addition to 'alg' and 'kid' to be included in the JWS.
   * @returns Signed payload in compact JWS format.
   */
  public static async sign(content: string, jwk: PrivateKey): Promise<string> {
    const privateKey = new EcKey(jwk);
    return privateKey.createSign('SHA256')
      .update(content)
      .sign('base64');
  }

  /**
   * ECIES encrypts the given data using the given public key in JWK format.
   */
  public static encryptECIES(data: Buffer, jwk: PublicKey): Promise<Buffer> {
    const { x, y } = jwk as EcPublicKey;
    const rawX = Buffer.from(x, 'base64').toString('hex');
    const rawY = Buffer.from(y, 'base64').toString('hex');
    const pub = rawX + rawY;
    return new Promise((resolve) => {
      const encrypted = encrypt(pub, data);
      resolve(encrypted);
    });
  }

  /**
   * ECIES decrypts the given data using the given private key in JWK format.
   * TODO: correctly implement this after getting rid of node-jose dependency.
   */
  public static decryptECIES(data: Buffer, jwk: PrivateKey): Promise<Buffer> {
    const ecJwk: EcPrivateKey = jwk as EcPrivateKey;
    const prv = Buffer.from(ecJwk.d, 'base64').toString('hex');
    return new Promise((resolve) => {
      const decrypted = decrypt(prv, data);
      resolve(decrypted);
    });
  }
}
