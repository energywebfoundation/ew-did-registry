import crypto from 'crypto';
import { IDIDDocumentLite, DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IResolverSettings, Resolver } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';
import { IPrivateClaim, IClaimFields } from './interface';
import { VerificationClaim } from '../public';
import { IPrivateClaimBuildData } from '../models';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const ecies = require('eciesjs');

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
        this.issuerDid = data.claimData.issuerDid;
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
      const privateClaimData = {
        did: this.claimData.did,
      };
      const saltedFields: IClaimFields = { };
      Object.entries(this.claimData).forEach(
        ([key, value]) => {
          if (key !== 'did') {
            const salt = crypto.randomBytes(32).toString('base64');
            const saltedValue = value + salt;
            let encrpytedSaltedValue;
            try {
              encrpytedSaltedValue = ecies.encrypt(issuerEthereumPublic, Buffer.from(saltedValue));
            } catch (error) {
              throw new Error(error);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            privateClaimData[key] = encrpytedSaltedValue;
            saltedFields[key] = saltedValue;
          }
        },
      );
      this.claimData = privateClaimData;
      return saltedFields;
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
     * privateClaim.decryptAndHashFields(issuerKeys.privateKey);
     * const hashedFields = privateClaim.claimData;
     * console.log(hashedFields);
     * ```
     *
     * @param {string} privateKey
     * @returns void
     */
    decryptAndHashFields(): void {
      let privateKeyIssuer = this.keyPair.privateKey;
      if (privateKeyIssuer.length === 32) {
        privateKeyIssuer = `0x${privateKeyIssuer}`;
      }
      const privateClaimData = {
        did: this.claimData.did,
      };
      Object.entries(this.claimData).forEach(
        ([key, value]) => {
          if (key !== 'did' && key !== 'signerDid') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const decryptedField = ecies.decrypt(privateKeyIssuer, Buffer.from(value.data));
            const fieldHash = crypto.createHash('sha256').update(decryptedField.toString()).digest('hex');
            const fieldKeys = new Keys({ privateKey: fieldHash });
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            privateClaimData[key] = fieldKeys.publicKey;
          }
        },
      );
      this.claimData = privateClaimData;
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
     * @param {{ [key: string]: string }} saltedFields
     * @returns boolean
     */
    verifyPayload(saltedFields: { [key: string]: string }): boolean {
      Object.entries(saltedFields).forEach(
        // eslint-disable-next-line consistent-return
        ([key, value]) => {
          if (key !== 'did') {
            const fieldHash = crypto.createHash('sha256').update(value).digest('hex');
            const fieldKeys = new Keys({ privateKey: fieldHash, publicKey: undefined });
            if (this.claimData[key] !== fieldKeys.publicKey) {
              return false;
            }
          }
        },
      );
      return true;
    }
}
export { IPrivateClaim, PrivateClaim };
