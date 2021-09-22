/* eslint-disable no-restricted-syntax */
import {
  Contract, ethers, Event, utils, BigNumber, providers,
} from 'ethers';
import {
  DIDAttribute,
  Encoding,
  IAuthentication,
  IOperator,
  IClaimsIssuer,
  IVerificationMethod,
  IServiceEndpoint,
  IUpdateData,
  IAttributePayload,
  VerificationMethodType,
  KeyTags,
  RegistrySettings,
  IUpdateAttributeData,
  IPublicClaim,
  ServiceEndpointType
} from '@fl-did-registry/did-resolver-interface';
import { Methods } from '@fl-did-registry/did';
import Resolver from './resolver';
import { JWT } from '@fl-did-registry/jwt';
import { IDidStore } from "@fl-did-registry/did-store-interface"
import {
  delegatePubKeyIdPattern, pubKeyIdPattern,
} from '../constants';
import { encodedPubKeyName, hexify, addressOf, addressAndIdOf, hashes, getProvider
} from '../utils';
import { EwSigner } from './ewSigner';

const { VerificationMethod, ServicePoint } = DIDAttribute;
const { formatBytes32String } = utils;

/**
 * To support/extend this Class, one just has to work with this file.
 * All the supporting functions are stored as private methods (i.e. with the '_' symbol)
 * One can easily extend the methods available by researching the smart contract functionality,
 * as well as by understanding how the read is performed.
 */
export class Operator extends Resolver implements IOperator {
  /**
   * ERC-1056 compliant ethereum smart-contract
   */
  private _didRegistry: Contract;

  private _owner: EwSigner;

  

  private readonly _keys = {
    privateKey: '',
    publicKey: '',
  };

  private address?: string;

  /**
  * @param owner - Entity which controls document
  * @param settings - Settings to connect to Ethr registry
  */
  constructor(owner: EwSigner, storage: IDidStore, settings: RegistrySettings) {
    super(owner.provider, storage, settings);
    const {
      address, abi,
    } = this.settings;
    this._owner = owner;
    this._keys.publicKey = owner.publicKey;
    this._didRegistry = new ethers.Contract(address, abi, owner);
  }

  protected async getOwnerDID(): Promise<string> {
    const address = await this.getAddress();
    return `did:${Methods.Erc1056}:${address}`
  }

  protected async getAddress(): Promise<string> {
    if (!this.address) {
      this.address = await this._owner.getAddress();
    }
    return this.address as string;
  }

  public getPublicKey(): string {
    return this._keys.publicKey;
  }

  /**
 * Relevant did should have positive cryptocurrency balance to perform
 * the transaction. Create method saves the public key in smart contract's
 * event, which can be qualified as document creation
 *
 * @param did
 * @param context
 * @returns Promise<boolean>
 */
  async create(did: string): Promise<boolean> {
    if (await this.identityOwner(did) != "") {
      return true;
    }
    return false;
  }

  /**
  * Sets attribute value in DID document identified by the did
  *
  * @example
  *```typescript
  * import {
  * Operator, DIDAttribute, Algorithms, PubKeyType, Encoding
  *  } from '@fl-did-registry/did-resolver';
  * import { Keys } from '@fl-did-registry/keys';
  * const providerSettings = {
  *   type: ProviderTypes.HTTP,
  *   uriOrInfo: 'https://volta-rpc.energyweb.org',
  * }
  * const ownerKeys = new Keys();
  * const operator = new Operator(ownerKeys);
  * const pKey = DIDAttribute.PublicKey;
  * const updateData = {
  *     algo: Algorithms.ED25519,
  *     type: PubKeyType.VerificationKey2018,
  *     encoding: Encoding.HEX,
  *     value: new Keys().publicKey,
  * };
  * const validity = 10 * 60 * 1000;
  * const updated = await operator.update(did, pKey, updateData, validity);
  * ```
  *
  * @param { string } did - did associated with DID document
  * @param { DIDAttribute } didAttribute - specifies updated section in DID document. Must be 31
  * bytes or shorter
  * @param { IUpdateData } updateData
  * @param { number } validity - time in milliseconds during which
  *                              attribute will be valid
  * @returns Promise<number>
  */
  async update(
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity: number = Number.MAX_SAFE_INTEGER - 1,
  ): Promise<BigNumber> {
    const registry = this._didRegistry;
    const method = didAttribute === VerificationMethod || didAttribute === ServicePoint
      ? registry.setAttribute
      : registry.addDelegate;
    if (validity < 0) {
      throw new Error('Validity must be non negative value');
    }
    return this._sendTransaction(method, did, didAttribute, updateData, validity);
  }

  /**
  * Revokes the delegate from DID Document
  * Returns true on success
  *
  * @param { string } did - did of identity of interest
  * @param { PubKeyType } delegateType - type of delegate of interest
  * @param { string } delegate - did of delegate of interest
  * @returns Promise<boolean>
  */
  async revokeDelegate(
    did: string,
    delegateType: VerificationMethodType,
    delegateDID: string,
  ): Promise<boolean> {
    await this._sendTransaction(
      this._didRegistry.revokeDelegate,
      did,
      DIDAttribute.Authenticate,
      {
        type: delegateType,
        delegate: addressOf(delegateDID),
      },
    );
    return true;
  }

  /**
  * Revokes attribute from DID Document
  * Returns true on success
  *
  * @param { string } did - did of identity of interest
  * @param { DIDAttribute } attributeType - type of attribute to revoke
  * @param { IUpdateData } updateData - data required to identify the correct attribute to revoke
  * @returns Promise<boolean>
  */
  async revokeAttribute(
    did: string,
    attributeType: DIDAttribute,
    updateData: IUpdateAttributeData,
  ): Promise<boolean> {
    await this._sendTransaction(
      this._didRegistry.revokeAttribute,
      did,
      attributeType,
      updateData,
    );
    return true;
  }

  /**
  * Revokes authentication methods, public keys and delegates from DID document
  *
  * @example
  * ```typescript
  *import { Operator } from '@fl-did-registry/did-resolver';
  *import { Keys } from '@fl-did-registry/keys';
  *
  * const providerSettings = {
  *   type: ProviderTypes.HTTP,
  *   uriOrInfo: 'https://volta-rpc.energyweb.org',
  * }
  * const ownerKeys = new Keys();
  * const owner = EwSigner.fromPrivateKey(ownerKeys.privateKey, providerSettings);
  * const operator = new Operator(
  *   owner,
  *   resolverSettings,
  *  );
  * const updated = await operator.deactivate(did);
  * ```
  *
  * @param did
  * @returns Promise<boolean>
  */
  async deactivate(did: string): Promise<void> {
    const document = await this.read(did);
    await this._revokeAuthentications(
      did,
      document.authentication as IAuthentication[],
      document.verificationMethod,
    );
    await this._revokePublicKeys(did, document.verificationMethod);
    await this._revokeServices(did, document.service);
  }

  /**
 * Revokes authentication attributes
 *
 * @param did
 * @param auths
 * @param publicKeys
 * @private
 */
  protected async _revokeAuthentications(
    did: string,
    auths: IAuthentication[],
    verificationMethods: IVerificationMethod[],
  ): Promise<void> {
    for await (const pk of verificationMethods) {
      const match = pk.id.match(delegatePubKeyIdPattern);
      if (match) {
        const type = auths.find(
          (auth) => (auth as IVerificationMethod).verificationMethod === match[0],
        ) ? VerificationMethodType.EcdsaSecp256k1RecoveryMethod2020
          : VerificationMethodType.EcdsaSecp256k1VerificationKey2019;
        await this.revokeDelegate(did, type, `did:${Methods.Erc1056}:${pk.ethereumAddress}`);
      }
    }
  }

  /**
 * Revokes Public key attribute
 *
 * @param did
 * @param publicKeys
 * @private
 */
  protected async _revokePublicKeys(did: string, verificationMethods: IVerificationMethod[]): Promise<void> {
    for await (const pk of verificationMethods) {
      const match = pk.id.match(pubKeyIdPattern);
      if (match) {
        const encoding = Object.values(Encoding)
          .find((enc) => pk[encodedPubKeyName(enc)]) as Encoding;
        await this.revokeAttribute(
          did,
          DIDAttribute.VerificationMethod,
          {
            type: DIDAttribute.VerificationMethod,
            value: {
              id: pk.id,
              verificationMethod: pk[encodedPubKeyName(encoding)] as string,
              tag: pk.id.split('#')[1],
            },
          },
        );
      }
    }
  }

  /**
 * Revokes service attributes
 *
 * @param did
 * @param services
 * @private
 */
  protected async _revokeServices(did: string, services: IServiceEndpoint[]): Promise<void> {
    for await (const service of services) {
      await this.revokeAttribute(
        did,
        DIDAttribute.ServicePoint,
        {
          type: DIDAttribute.ServicePoint,
          value: {
            id: service.id,
            type: service.type,
            serviceEndpoint: service.serviceEndpoint,
          },
        },
      );
    }
  }

  /**
 * Private function to send transactions
 *
 * @param method
 * @param did
 * @param didAttribute
 * @param updateData
 * @param validity
 * @param overrides
 * @private
 */
  protected async _sendTransaction(
    method: Function,
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity?: number,
    overrides?: {
      nonce?: number;
      gasLimit?: number;
    },
  ): Promise<BigNumber> {
    const [ nft_address, nft_id ] = addressAndIdOf(did);
    const name = formatBytes32String(
      this._composeAttributeName(didAttribute, updateData),
    );
    const value = hexify(
      didAttribute === VerificationMethod || didAttribute === ServicePoint
        ? updateData.value as IAttributePayload
        : updateData.delegate as string,
    );
    const params: (string | number | Record<string, unknown>)[] = [
      nft_address, nft_id,
      name,
      value,
    ];
    if (validity !== undefined) {
      params.push(validity);
    }
    if (overrides) {
      params.push(overrides);
    } else {
      const overrides: {gasLimit: number} = {gasLimit: 80000}
      params.push(overrides);
    }
    try {
      const tx = await method(...params);
      const receipt = await tx.wait();
      const event: Event = receipt.events.find(
        (e: Event) => (didAttribute === DIDAttribute.VerificationMethod && e.event === 'DIDAttributeChanged')
          || (didAttribute === DIDAttribute.ServicePoint && e.event === 'DIDAttributeChanged')
          || (didAttribute === DIDAttribute.Authenticate && e.event === 'DIDDelegateChanged'),
      );
      return BigNumber.from(event.blockNumber as number);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
 * Util functions to create attribute name, supported by read method
 *
 * @param attribute
 * @param updateData
 * @private
 */
  protected _composeAttributeName(attribute: DIDAttribute, updateData: IUpdateData): string {
    const {
      type, encoding,
    } = updateData;
    switch (attribute) {
      case DIDAttribute.VerificationMethod:
        return `did/${DIDAttribute.VerificationMethod}/${type}/${encoding}`;
      case DIDAttribute.Authenticate:
        return updateData.type;
      case DIDAttribute.ServicePoint:
        return `did/${DIDAttribute.ServicePoint}/${updateData.type}`;
      default:
        throw new Error('Unknown attribute name');
    }
  }

  async createPublicClaim(publicData: object, did: string, jwtOptions = { subject: '', issuer: '' }): Promise<string> {
    jwtOptions.issuer = await this.getOwnerDID();
    jwtOptions.subject = did;
    const claim: IPublicClaim = {
      subject: did,
      issuer: await this.getOwnerDID(),
      claimData: publicData,
    };
    return JWT.sign(
      this._owner,
      claim,
      {
        ...jwtOptions, algorithm: 'ES256',
      },
    )
  }

  async publishPublicClaim(
    issued: string,
    verifyData: object,
    opts: { hashAlg: string; createHash: (data: string) => string } = { hashAlg: 'SHA256', createHash: hashes.SHA256 }): Promise<string> {
    const verified = await this.verifyPublicClaim(issued, verifyData);
    if (!verified) {
      return '';
    }
    const { hashAlg, createHash } = opts;
    const claim = JWT.decode(issued) as IPublicClaim;

    const hash = createHash(issued);
    const url = await this._claimStorage.save(JSON.stringify(claim));
    await this.update(
      claim.subject,
      DIDAttribute.ServicePoint,
      {
        type: ServiceEndpointType.ClaimRepo,
        value: { serviceEndpoint: url, hash: hash },
      },
    );
    return url;
  }
}
