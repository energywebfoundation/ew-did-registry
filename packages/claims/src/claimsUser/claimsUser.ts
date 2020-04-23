/* eslint-disable new-cap */
/* eslint-disable max-len */
import crypto from 'crypto';
import { encrypt } from 'eciesjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import assert from 'assert';
import {
  Algorithms,
  DelegateTypes,
  DIDAttribute,
  Encoding,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';
import {
  IPrivateClaim, IProofClaim, IProofData, IPublicClaim, ISaltedFields,
} from '../models';
import { IClaimsUser } from '../interface';
import { Claims } from '../claims';
import { hashes } from '../utils';

const { bn, hash, bitArray } = sjcl;

export class ClaimsUser extends Claims implements IClaimsUser {
  curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;

  q = this.curve.r;

  g = this.curve.G;

  paranoia = 6;

  /**
   *
   * Creates token with data about subject provided in claimData
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new ClaimsUser(user);
   * const claimData = {
   *     name: 'John'
   * };
   * const token = await claims.createPublicClaim(claimData);
   * ```
   * @param { IClaimData } publicData
   *
   * @returns { Promise<string> }
   */
  async createPublicClaim(publicData: object, jwtOptions = { subject: '', issuer: '' }): Promise<string> {
    jwtOptions.subject = jwtOptions.subject || this.did;
    jwtOptions.issuer = this.did;
    const claim: IPublicClaim = {
      did: jwtOptions.subject,
      signer: this.did,
      claimData: publicData,
    };
    return this.jwt.sign(
      claim,
      {
        ...jwtOptions, algorithm: 'ES256',
      },
    );
  }

  /**
   * Used by the claim subject to create token with subject encrypted
   * private data which afterwards will be sent to the issuer. Salted private
   * fields will be saved in the `saltedFields` argument
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new ClaimsUser(user);
   * const claimData = {
   *     secret: '123'
   * };
   * const claim = await claims.createPrivateClaim(claimData, issuer);
   * ```
   * @param { IClaimData } publicData object with claim subject private data
   * @param { string } issuer DID
   *
   * @returns { Promise<{token: string, saltedFields:{ [key: string]: string }}> } token with private data encrypted by issuer key
   */
  async createPrivateClaim(
    privateData: { [key: string]: string },
    issuer: string,
    jwtOptions = { subject: '', issuer: '' },
  ): Promise<{ token: string; saltedFields: ISaltedFields }> {
    jwtOptions.subject = jwtOptions.subject || this.did;
    jwtOptions.issuer = this.did;
    const saltedFields: { [key: string]: string } = {};
    const claim: IPrivateClaim = {
      did: this.did,
      signer: this.did,
      claimData: privateData,
    };
    const issuerDocument = await this.document.read(issuer);
    const issuerPK = issuerDocument
      .publicKey
      .find((pk: { type: string }) => pk.type === 'Secp256k1veriKey')
      .publicKeyHex;
    Object.entries(privateData).forEach(([key, value]) => {
      const salt = crypto.randomBytes(32).toString('base64');
      const saltedValue = value + salt;
      const encryptedValue = encrypt(issuerPK, Buffer.from(saltedValue));
      claim.claimData[key] = encryptedValue.toString('hex');
      saltedFields[key] = saltedValue;
    });
    const token = await this.jwt.sign(claim, {
      ...jwtOptions, algorithm: 'ES256',
    });
    return { token, saltedFields };
  }

  /**
   * Used by the claim subject based on the salted values calculated
   * when creating private claim
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new ClaimsUser(user);
   * const claimUrl = 'http://example.com';
   * const saltedFields = {
   *    secret: '123abc'
   * };
   * const claim = await claims.createProofClaim(claimUrl, saltedFields);
   * ```
   * @param { string } claimUrl - url of previously saved token
   * @param { { [keys: string]: string } } saltedFields - salted private user data
   *
   * @returns { Promise<string> }
   */
  async createProofClaim(
    claimUrl: string,
    proofData: IProofData,
    jwtOptions = { subject: '', issuer: '' },
  ): Promise<string> {
    jwtOptions.subject = jwtOptions.subject || this.did;
    jwtOptions.issuer = this.did;
    const claim: IProofClaim = {
      did: this.did,
      signer: this.did,
      claimUrl,
      proofData,
    };
    Object.entries(proofData).forEach(([key, field]) => {
      if (field.encrypted) {
        const k = bn.random(this.q, this.paranoia);
        const h: sjcl.SjclEllipticalPoint = this.g.mult(k);
        const hashedField = crypto.createHash('sha256').update(field.value as string).digest('hex');
        const a = new bn(hashedField);
        const PK = this.g.mult(a);
        const c: sjcl.BigNumber = bn.fromBits(hash.sha256.hash(
          this.g.x.toBits()
            .concat(h.toBits())
            .concat(PK.toBits()),
        ));
        const ca = c.mul(a).mod(this.q);
        const s = ca.add(k).mod(this.q);
        claim.proofData[key] = {
          value: { h: h.toBits(), s: s.toBits() },
          encrypted: true,
        };
      } else {
        claim.proofData[key] = {
          value: field.value,
          encrypted: false,
        };
      }
    });
    return this.jwt.sign(claim, {
      ...jwtOptions, algorithm: 'ES256',
    });
  }

  /**
   * Verifies token received from issuer
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new UserClaims(user);
   * const verified = await claims.verifyPublicToken(issuedToken);
   * ```
   * @param { string } token - issued token
   * @returns {Promise<string>}
   * @throws if the proof failed
   */
  async verifyPublicClaim(token: string, verifyData: object): Promise<boolean> {
    const claim = this.jwt.decode(token) as IPublicClaim;
    if (!(await this.verifySignature(token, (claim as any).iss))) {
      throw new Error('Incorrect signature');
    }
    assert.deepEqual(claim.claimData, verifyData, 'Token payload doesn\'t match user data');
    const [, , issAddress] = (claim.iss as string).split(':');
    const issIsDelegate = await this.document.isValidDelegate(DelegateTypes.verification, (claim as any).iss);
    if (issIsDelegate) {
      return true;
    }
    await this.document.update(
      DIDAttribute.Authenticate,
      {
        algo: Algorithms.ED25519,
        type: PubKeyType.VerificationKey2018,
        encoding: Encoding.HEX,
        delegate: issAddress,
      },
    );
    return true;
  }

  /**
   * Verifies token with private data received from issuer
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new UserClaims(user);
   * const verified = await claims.verifyPrivateToken(issuedToken);
   * ```
   * @param { string } token - issued token
   * @returns {Promise<string>}
   * @throw if the proof failed
   */
  async verifyPrivateClaim(token: string, saltedFields: ISaltedFields): Promise<boolean> {
    const claim = this.jwt.decode(token) as IPrivateClaim;
    if (!(await this.verifySignature(token, (claim as any).iss))) {
      throw new Error('Invalid signature');
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(saltedFields)) {
      const fieldHash = crypto.createHash('sha256').update(value).digest('hex');
      const PK = this.g.mult(new bn(fieldHash));
      if (!bitArray.equal(claim.claimData[key], PK.toBits())) {
        throw new Error('Issued claim data doesn\'t match user data');
      }
    }
    const [, , issAddress] = (claim.iss as string).split(':');
    const issIsDelegate = await this.document.isValidDelegate(DelegateTypes.verification, (claim as any).iss);
    if (issIsDelegate) {
      return true;
    }
    await this.document.update(
      DIDAttribute.Authenticate,
      {
        algo: Algorithms.ED25519,
        type: PubKeyType.VerificationKey2018,
        encoding: Encoding.HEX,
        delegate: issAddress,
      },
    );
    return true;
  }

  /**
     * Verifies content of the issued claim, issuer identity and adds claim to service endpoints
     *
     * @param issued {string} claim approved by the issuer
     * @param verifyData {object} user data that should be contained in issued claim
     *
     * @returns {string} url of the saved claim
     */
  async publishPublicClaim(
    issued: string, verifyData: object, opts?: { hashAlg: string; createHash: (data: string) => string },
  ): Promise<string> {
    const verified = await this.verifyPublicClaim(issued, verifyData);
    if (verified) {
      return this.addClaimToServiceEndpoints(issued, opts);
    }
    return '';
  }

  /**
   * Verifies content of the issued claim, issuer identity and add claim to service endpoints
   *
   * @param issued {string} claim with encrypted user data approved by the issuer
   * @param saltedFields {ISaltedFields} private user data
   *
   * @returns {string} url of the saved claim
   */
  async publishPrivateClaim(
    issued: string, saltedFields: ISaltedFields, opts?: { hashAlg: string; createHash: (data: string) => string },
  ): Promise<string> {
    const verified = await this.verifyPrivateClaim(issued, saltedFields);
    if (verified) {
      return this.addClaimToServiceEndpoints(issued, opts);
    }
    return '';
  }

  private async addClaimToServiceEndpoints(
    claim: string,
    opts: { hashAlg: string; createHash: (data: string) => string } = { hashAlg: 'SHA256', createHash: hashes.SHA256 },
  ): Promise<string> {
    const { hashAlg, createHash } = opts;
    const url = await this.store.save(claim);
    await this.document.update(
      DIDAttribute.ServicePoint,
      {
        type: PubKeyType.VerificationKey2018,
        value: JSON.stringify({ serviceEndpoint: url, hash: createHash(claim), hashAlg }),
      },
    );
    return url;
  }
}
