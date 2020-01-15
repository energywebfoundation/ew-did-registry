import crypto from 'crypto';
import { encrypt, decrypt } from 'eciesjs';
import { IDIDDocumentLite, DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IResolverSettings, Resolver } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';
import { IPrivateClaim, IClaimFields } from './interface';
import { VerificationClaim } from '../public';
import { IPrivateClaimBuildData } from '../models';

class PrivateClaim extends VerificationClaim implements IPrivateClaim {
  public issuerDid: string;

  private resolverSettings: IResolverSettings;

  /**
   * Constructor takes as input Private Claim data.
   * eslint warning disabled to ensure type-checking.
   * @param data
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(data: IPrivateClaimBuildData) {
    super(data);
    if (data.token === undefined) {
      this.issuerDid = data.claimData.issuerDid as string;
    }
    this.resolverSettings = data.resolverSettings;
  }

  /**
   * Creation of Private Claim is a separate method to avoid asynchronous calls in the constructor
   *
   * @example
   * ```typescript
   * import { PrivateClaim } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   * import { JWT } from '@ew-did-registry/jwt';
   * const keys = new Keys();
   * const jwt = new JWT(keys);
   * const claimData = {
   *  did: `did:ewc:0x${keys.publicKey}`,
   *  issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
   *  test: 'test',
   * };
   *
   * const data = {
   *  jwt,
   *  keyPair: keys,
   *  claimData,
   * };
   * const privateClaim = new PrivateClaim(data);
   * await privateClaim.createPrivateClaimData();
   * console.log(privateClaim);
   * ```
   * @returns {Promise<{ [key: string]: string }}
   */
  async createPrivateClaimData(): Promise<IClaimFields> {
    let issuerDocumentLite: IDIDDocumentLite;
    try {
      const resolver = new Resolver(this.resolverSettings);
      const documentFactory = new DIDDocumentFactory(this.issuerDid);
      issuerDocumentLite = documentFactory.createLite(resolver);
      await issuerDocumentLite.read('did');
    } catch (error) {
      throw new Error(error);
    }

    const issuerPublicKey = issuerDocumentLite.didDocument.publicKey.find((pk) => pk.type === 'Secp256k1VerificationKey');
    const issuerEthereumPublic = issuerPublicKey.ethereumAddress;

    const results = Object.entries(this.claimData).reduce((accumulator, currentValue) => {
      const [key, value] = currentValue;
      if (key !== 'did') {
        const salt = crypto.randomBytes(32).toString('base64');
        const saltedValue = value + salt;
        let encrpytedSaltedValue;
        try {
          encrpytedSaltedValue = encrypt(issuerEthereumPublic, Buffer.from(saltedValue));
        } catch (error) {
          throw new Error(error);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        accumulator.privateClaimData[key] = encrpytedSaltedValue;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        accumulator.saltedFields[key] = saltedValue;
      }
      return accumulator;
    },
    { privateClaimData: { did: this.claimData.did }, saltedFields: {} });

    this.claimData = results.privateClaimData;
    return results.saltedFields;
  }

  /**
   * This method is called when the issuer receives the token from the user with encrypted data
   *
   * @example
   * ```typescript
   * import { PrivateClaim } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   * import { JWT } from '@ew-did-registry/jwt';
   * const keys = new Keys();
   * const issuerKeys = new Keys();
   * const jwt = new JWT(keys);
   * const claimData = {
   * did: `did:ewc:0x${keys.publicKey}`,
   * issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
   *  test: 'test',
   * };
   * const data = {
   *  jwt,
   *  keyPair: keys,
   *  claimData,
   * };
   * const privateClaim = new PrivateClaim(data);
   * await privateClaim.createPrivateClaimData();
   *
   * const issuerJWT = new JWT(issuerKeys);
   * const issuerData = {
   *  jwt: issuerJWT,
   *  keyPair: issuerKeys,
   *  token: privateClaim.token,
   * }
   * const privateClaimIssuer = new PrivateClaim(issuerData);
   * privateClaimIssuer.decryptAndHashFields();
   * const hashedFields = privateClaimIssuer.claimData;
   * console.log(hashedFields);
   * ```
   *
   * @returns void
   */
  decryptAndHashFields(): void {
    let privateKeyIssuer = this.keyPair.privateKey;
    if (privateKeyIssuer.length === 32) {
      privateKeyIssuer = `0x${privateKeyIssuer}`;
    }

    this.claimData = Object.entries(this.claimData).reduce((accumulator, currentValue) => {
      const [key, value] = currentValue;
      if (key !== 'did' && key !== 'signerDid') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const decryptedField = decrypt(privateKeyIssuer, Buffer.from(value.data));
        const fieldHash = crypto.createHash('sha256').update(decryptedField.toString()).digest('hex');
        const fieldKeys = new Keys({ privateKey: fieldHash });
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        accumulator[key] = fieldKeys.publicKey;
      }
      return accumulator;
    }, { did: this.claimData.did });
  }

  /**
   * This method is called by the user after the issuer returns signed JWT with hashed
   * encrypted fields. Methods verifies if the payload was created correctly
   *
   * @example
   * ```typescript
   * import { PrivateClaim } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   * import { JWT } from '@ew-did-registry/jwt';
   * const keys = new Keys();
   * const issuerKeys = new Keys();
   * const jwt = new JWT(keys);
   * const claimData = {
   * did: `did:ewc:0x${keys.publicKey}`,
   * issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
   *  test: 'test',
   * };
   * const data = {
   *  jwt,
   *  keyPair: keys,
   *  claimData,
   * };
   * const privateClaim = new PrivateClaim(data);
   * const saltedFields = await privateClaim.createPrivateClaimData();
   * privateClaim.decryptAndHashFields(issuerKeys.privateKey);
   * const issuerSignedToken = await issuerJWT.sign(privateClaim.claimData,
   * { algorithm: 'ES256', noTimestamp: true });
   * const issuerClaimData = {
   *  did: `did:ewc:0x${issuerKeys.publicKey}`,
   * };
   * const issuerData = {
   *  jwt,
   *  keyPair: keys,
   *  token: issuerSignedToken,
   *  claimData: issuerClaimData,
   * }
   * const issuerReturnedPrivateClaim = new PrivateClaim(issuerData);
   * issuerReturnedPrivateClaim.verify();
   * const verified = issuerReturnedPrivateClaim.verifyPayload(saltedFields);
   * console.log(verified);
   * ```
   *
   * @param {IClaimFields} saltedFields
   * @returns boolean
   */
  verifyPayload(saltedFields: IClaimFields): boolean {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(saltedFields)) {
      const value = saltedFields[key];
      if (key !== 'did') {
        const fieldHash = crypto.createHash('sha256').update(value).digest('hex');
        const fieldKeys = new Keys({ privateKey: fieldHash });
        if (this.claimData[key] !== fieldKeys.publicKey) {
          return false;
        }
      }
    }

    return true;
  }
}
export { IPrivateClaim, PrivateClaim, IClaimFields };
