/* eslint-disable no-restricted-syntax */
import { Contract, ethers, Event, utils, BigNumber } from 'ethers';
import {
  DIDAttribute,
  Encoding,
  IAuthentication,
  IOperator,
  IPublicKey,
  IServiceEndpoint,
  IUpdateData,
  IAttributePayload,
  PubKeyType,
  KeyTags,
  RegistrySettings,
  IUpdateAttributeData,
} from '@ew-did-registry/did-resolver-interface';
import { Methods } from '@ew-did-registry/did';
import { KeyType } from '@ew-did-registry/keys';
import Resolver from './resolver';
import { delegatePubKeyIdPattern, pubKeyIdPattern } from '../constants';
import { encodedPubKeyName, hexify, addressOf } from '../utils';
import { EwSigner } from './ewSigner';

const { PublicKey, ServicePoint } = DIDAttribute;
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
  constructor(owner: EwSigner, settings: RegistrySettings) {
    super(owner.provider, settings);

    const { address, abi } = this.settings;
    this._owner = owner;
    this._keys.publicKey = owner.publicKey;
    this._didRegistry = new ethers.Contract(address, abi, owner);
  }

  protected async getAddress(): Promise<string> {
    if (!this.address) {
      this.address = await this._owner.getAddress();
    }
    return this.address as string;
  }

  private async did(): Promise<string> {
    return `did:${this.settings.method}:${await this.getAddress()}`;
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
  async create(): Promise<boolean> {
    const did = await this.did();
    const readPubKey = await this.readOwnerPubKey(did);
    if (readPubKey) {
      return true;
    }
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: KeyType.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${this.getPublicKey()}`, tag: KeyTags.OWNER },
    };
    await this.update(did, attribute, updateData);
    return true;
  }

  /**
   * Sets attribute value in DID document identified by the did
   *
   * @example
   *```typescript
   * import {
   * Operator, DIDAttribute, Algorithms, PubKeyType, Encoding
   *  } from '@ew-did-registry/did-resolver';
   * import { Keys } from '@ew-did-registry/keys';
   * const providerSettings = {
   *   type: ProviderTypes.HTTP,
   *   uriOrInfo: 'https://volta-rpc.energyweb.org',
   * }
   * const ownerKeys = new Keys();
   * const owner = EwSigner.fromPrivateKey(ownerKeys.privateKey, providerSettings);
   * const operator = new Operator(
   *     owner,
   *     resolverSettings,
   *    );
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
    validity: number = Number.MAX_SAFE_INTEGER - 1 // preventing BigNumber.from overflow error
  ): Promise<BigNumber> {
    const method =
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? 'setAttribute'
        : 'addDelegate';
    if (validity < 0) {
      throw new Error('Validity must be non negative value');
    }
    if (didAttribute === ServicePoint) {
      if (!updateData.value?.serviceEndpoint) {
        throw new Error('Service Endpoint is required');
      }
      const userDIDDoc = await this.read(did);
      for (const svc of userDIDDoc.service) {
        if (svc.serviceEndpoint === updateData.value?.serviceEndpoint) {
          throw new Error('Service Endpoint already exist');
        }
      }
    }
    return this._sendTransaction(
      method,
      did,
      didAttribute,
      updateData,
      validity
    );
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
    delegateType: PubKeyType,
    delegateDID: string
  ): Promise<boolean> {
    await this._sendTransaction(
      'revokeDelegate',
      did,
      DIDAttribute.Authenticate,
      {
        type: delegateType,
        delegate: addressOf(delegateDID),
      }
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
    updateData: IUpdateAttributeData
  ): Promise<boolean> {
    await this._sendTransaction(
      'revokeAttribute',
      did,
      attributeType,
      updateData
    );
    return true;
  }

  /**
   * Changes the owner of particular decentralised identity
   * Returns true on success
   *
   * @param { string } did - did of current identity owner
   * @param { string } newOwner - did of new owner that will be set on success
   * @returns Promise<boolean>
   */
  async changeOwner(did: string, newOwner: string): Promise<boolean> {
    try {
      const tx = await this._didRegistry.changeOwner(
        addressOf(did),
        addressOf(newOwner)
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: Event) => e.event === 'DIDOwnerChanged'
      );
      if (!event) return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return true;
  }

  /**
   * Revokes authentication methods, public keys and delegates from DID document
   *
   * @example
   * ```typescript
   *import { Operator } from '@ew-did-registry/did-resolver';
   *import { Keys } from '@ew-did-registry/keys';
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
      document.publicKey
    );
    await this._revokePublicKeys(did, document.publicKey);
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
    publicKeys: IPublicKey[]
  ): Promise<void> {
    for await (const pk of publicKeys) {
      const match = pk.id.match(delegatePubKeyIdPattern);
      if (match) {
        const type = auths.find((auth) => auth.publicKey === match[0])
          ? PubKeyType.SignatureAuthentication2018
          : PubKeyType.VerificationKey2018;
        await this.revokeDelegate(
          did,
          type,
          `did:${Methods.Erc1056}:${pk.ethereumAddress}`
        );
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
  protected async _revokePublicKeys(
    did: string,
    publicKeys: IPublicKey[]
  ): Promise<void> {
    for await (const pk of publicKeys) {
      const match = pk.id.match(pubKeyIdPattern);
      if (match) {
        const encoding = Object.values(Encoding).find(
          (enc) => pk[encodedPubKeyName(enc)]
        ) as Encoding;
        await this.revokeAttribute(did, DIDAttribute.PublicKey, {
          type: DIDAttribute.PublicKey,
          value: {
            id: pk.id,
            publicKey: pk[encodedPubKeyName(encoding)] as string,
            tag: pk.id.split('#')[1],
          },
        });
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
  protected async _revokeServices(
    did: string,
    services: IServiceEndpoint[]
  ): Promise<void> {
    for await (const service of services) {
      await this.revokeAttribute(did, DIDAttribute.ServicePoint, {
        type: DIDAttribute.ServicePoint,
        value: {
          id: service.id,
          type: service.type,
          serviceEndpoint: service.serviceEndpoint,
        },
      });
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
    method: string,
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity?: number,
    overrides?: {
      nonce?: number;
    }
  ): Promise<BigNumber> {
    const identity = addressOf(did);
    const name = formatBytes32String(
      this._composeAttributeName(didAttribute, updateData)
    );
    const value = hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? (updateData.value as IAttributePayload)
        : (updateData.delegate as string)
    );
    const params: (string | number | Record<string, unknown>)[] = [
      identity,
      name,
      value,
    ];
    if (validity !== undefined) {
      params.push(validity);
    }
    if (overrides) {
      params.push(overrides);
    }
    try {
      const tx = await this._didRegistry[method](...params);
      const receipt = await tx.wait();
      const event: Event = receipt.events.find(
        (e: Event) =>
          (didAttribute === DIDAttribute.PublicKey &&
            e.event === 'DIDAttributeChanged') ||
          (didAttribute === DIDAttribute.ServicePoint &&
            e.event === 'DIDAttributeChanged') ||
          (didAttribute === DIDAttribute.Authenticate &&
            e.event === 'DIDDelegateChanged')
      );
      return BigNumber.from(event.blockNumber as number);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return BigNumber.from(0);
  }

  /**
   * Util functions to create attribute name, supported by read method
   *
   * @param attribute
   * @param updateData
   * @private
   */
  protected _composeAttributeName(
    attribute: DIDAttribute,
    updateData: IUpdateData
  ): string {
    const { algo, type, encoding } = updateData;
    switch (attribute) {
      case DIDAttribute.PublicKey:
        return `did/${DIDAttribute.PublicKey}/${algo}/${type}/${encoding}`;
      case DIDAttribute.Authenticate:
        return updateData.type;
      case DIDAttribute.ServicePoint:
        return `did/${DIDAttribute.ServicePoint}/${
          (updateData.value as IAttributePayload).type
        }`;
      default:
        throw new Error('Unknown attribute name');
    }
  }
}
