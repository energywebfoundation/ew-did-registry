import { IDIDDocumentFull } from '@ew-did-registry/did-document';
import { IJWT, JWT, JwtPayload } from '@ew-did-registry/jwt';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import {
  IDIDDocument,
  IServiceEndpoint,
} from '@ew-did-registry/did-resolver-interface';
import { EwSigner } from '@ew-did-registry/did-ethr-resolver';
import {
  IClaims,
  IPublicClaim,
  IPrivateClaim,
  VerificationPurpose,
} from '../models';
import { hashes } from '../utils';
import { ProofVerifier } from '../claimsVerifier/proofVerifier';

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

  public did: string;

  /**
   * @constructor
   *
   * @param { IKeys } keys
   * @param document
   * @param store
   */
  constructor(
    owner: EwSigner,
    protected document: IDIDDocumentFull,
    protected store: IDidStore,
  ) {
    this.keys = { publicKey: owner.publicKey, privateKey: owner.privateKey };
    this.jwt = new JWT(owner);
    this.did = document.did;
  }

  /**
   * Verifies issuance and publishing of claim at `claimUrl`.
   * On successful verification returns claim
   *
   * @param claimUrl {string}
   * @param hashFns {{ [alg: string]: (data: string) => string }}
   *
   */
  async verify(
    claimUrl: string,
    {
      hashFns,
      issuerDoc,
      holderDoc,
      verificationPurpose = VerificationPurpose.Authentication,
    }: {
      hashFns?: { [alg: string]: (data: string) => string };
      issuerDoc?: IDIDDocument;
      holderDoc?: IDIDDocument;
      verificationPurpose?: VerificationPurpose;
    } = {},
  ): Promise<IPublicClaim | IPrivateClaim> {
    const token = await this.store.get(claimUrl);
    const claim = this.jwt.decode(token) as (IPublicClaim | IPrivateClaim) &
      JwtPayload;
    if (!issuerDoc) {
      issuerDoc = await this.document.read(claim.iss);
    }
    if (!holderDoc) {
      holderDoc = await this.document.read(claim.sub);
    }
    await this.validateServiceEndpointToken(claimUrl, {
      hashFns,
      holderDoc,
    });

    const proofVerifier = new ProofVerifier(issuerDoc);
    switch (verificationPurpose) {
      case VerificationPurpose.Authentication:
        if (await proofVerifier.verifyAuthenticationProof(token)) {
          return claim;
        }
        break;
      case VerificationPurpose.Assertion:
        if (await proofVerifier.verifyAssertionProof(token)) {
          return claim;
        }
        break;
      default:
        break;
    }
    throw new Error('Token is not verified');
  }

  /**
   * @description Verifies that token stored at `claimUrl` represents service
   * endpoint of `holderDoc`
   * @param claimUrl
   * @param param1
   */
  async validateServiceEndpointToken(
    claimUrl: string,
    {
      hashFns,
      holderDoc,
    }: {
      hashFns?: { [alg: string]: (data: string) => string };
      holderDoc: IDIDDocument;
    },
  ) {
    const token = await this.store.get(claimUrl);
    const service = holderDoc.service.find(
      (s) => s.serviceEndpoint === claimUrl,
    ) as IServiceEndpoint;
    if (!service) {
      throw new Error(`No service endpoint found for ${claimUrl} in holder DID document`);
    }
    const { hash, hashAlg } = service;
    const createHash = { ...hashes, ...hashFns }[hashAlg as string];
    if (hash !== createHash(token)) {
      throw new Error(`Claim at ${claimUrl} was changed`);
    }
  }
}
