import crypto from 'crypto';
import { IDIDDocumentLite, DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IResolverSettings, Resolver } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';
import { IPrivateClaim } from './interface';
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

    async createPrivateClaimData(): Promise<{ [key: string]: string }> {
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
      const saltedFields: { [key: string]: string } = { };
      Object.entries(this.claimData).forEach(
        ([key, value]) => {
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
        },
      );
      this.claimData = privateClaimData;
      return saltedFields;
    }

    decryptAndHashFields(privateKey: string): void {
      if (privateKey.length === 32) {
        privateKey = `0x${privateKey}`;
      }
      const privateClaimData = {
        did: this.issuerDid,
      };
      Object.entries(this.claimData).forEach(
        ([key, value]) => {
          if (key !== 'did') {
            const decryptedField = ecies.decrypt(privateKey, value).toString();
            const fieldHash = crypto.createHash('sha256').update(decryptedField).digest('hex');
            const fieldKeys = new Keys({ privateKey: fieldHash, publicKey: undefined });
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            privateClaimData[key] = fieldKeys.publicKey;
          }
        },
      );
      this.claimData = privateClaimData;
    }

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
