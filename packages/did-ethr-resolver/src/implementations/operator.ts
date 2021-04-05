/* eslint-disable no-restricted-syntax */
import {
  utils, providers,
} from 'ethers';
import {
  Algorithms,
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
  IdentityOwner,
  IUpdateAttributeData,
  IUpdateDelegateData,
} from '@ew-did-registry/did-resolver-interface';
import { Methods } from '@ew-did-registry/did';
import Resolver from './resolver';
import {
  delegatePubKeyIdPattern, pubKeyIdPattern,
} from '../constants';
import { encodedPubKeyName, hexify, addressOf } from '../utils';
import { EthrRegistry__factory as RegistryFactory } from '../../contractTypes/factories/EthrRegistry__factory';
import { EthrRegistry } from '../../contractTypes/EthrRegistry';

const { PublicKey, ServicePoint } = DIDAttribute;
const { BigNumber, formatBytes32String } = utils;

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
  private _registry: EthrRegistry;

  private readonly _keys = {
    privateKey: '',
    publicKey: '',
  };

  private address?: string;

  protected readonly _owner: IdentityOwner;

  public static defaultValidity = Number.MAX_SAFE_INTEGER;

  /**
 * @param { IdentityOwner } owner - entity which controls document updatable by this operator
 */
  constructor(owner: IdentityOwner, settings: RegistrySettings) {
    super(owner.provider as providers.Provider, settings);
    const {
      address,
    } = this.settings;
    this._owner = owner;
    this._registry = new RegistryFactory(this._owner).attach(address);
    this._keys.publicKey = owner.publicKey;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(): Promise<boolean> {
    const did = await this.did();
    if (await this.readOwnerPubKey(did)) {
      return true;
    }
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${this.getPublicKey()}`, tag: KeyTags.OWNER },
    };
    const validity = 10 * 60 * 1000;
    await this.update(did, attribute, updateData, validity);
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
  *
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
  * @param { DIDAttribute } attribute - specifies updated section in DID document. Must be 31
  * bytes or shorter
  * @param { IUpdateData } data
  * @param { number } validity - time in seconds during which
  *                              attribute will be valid
  * @returns Promise<number>
  */
  async update(
    did: string,
    attribute: DIDAttribute,
    data: IUpdateData,
    validity?: number,
  ): Promise<utils.BigNumber> {
    if (validity && validity < 0) {
      throw new Error('Validity must be non negative value');
    }
    return attribute === PublicKey || attribute === ServicePoint
      ? this._updateAttribute({
        did, attribute, data: data as IUpdateAttributeData, validity,
      })
      : this._updateDelegate({ did, data: data as IUpdateDelegateData, validity });
  }

  protected async _updateAttribute(
    {
      did,
      attribute,
      data,
      validity = Operator.defaultValidity,
      revoke = false,
    }: {
      did: string;
      attribute: DIDAttribute;
      data: IUpdateAttributeData;
      validity?: number;
      revoke?: boolean;
    },
  ): Promise<utils.BigNumber> {
    const params: [string, string, string] = [
      addressOf(did),
      formatBytes32String(this._composeAttributeName(attribute, data)),
      hexify(data.value),
    ];
    const tx = revoke
      ? this._registry.interface.functions.revokeAttribute.encode(params)
      : this._registry.interface.functions.setAttribute.encode([...params, validity]);
    return this._send(tx);
  }

  protected async _updateDelegate(
    {
      did,
      data,
      validity = Operator.defaultValidity,
      revoke = false,
    }: {
      did: string;
      data: IUpdateDelegateData;
      validity?: number;
      revoke?: boolean;
    },
  ): Promise<utils.BigNumber> {
    const params: [string, string, string] = [
      addressOf(did),
      formatBytes32String(this._composeAttributeName(DIDAttribute.Authenticate, data)),
      hexify(data.delegate),
    ];
    const tx = revoke
      ? this._registry.interface.functions.revokeDelegate.encode(params)
      : this._registry.interface.functions.addDelegate.encode([...params, validity]);
    return this._send(tx);
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
    delegateDID: string,
  ): Promise<boolean> {
    await this._updateDelegate({
      did,
      data: {
        type: delegateType,
        delegate: addressOf(delegateDID),
      },
      revoke: true,
    });
    return true;
  }

  /**
  * Revokes attribute from DID Document
  * Returns true on success
  *
  * @param { string } did - did of identity of interest
  * @param { DIDAttribute } attribute - type of attribute to revoke
  * @param { IUpdateData } data - data required to identify the correct attribute to revoke
  * @returns Promise<boolean>
  */
  async revokeAttribute(
    did: string,
    attribute: DIDAttribute,
    data: IUpdateAttributeData,
  ): Promise<boolean> {
    await this._updateAttribute({
      did,
      attribute,
      data,
      revoke: true,
    });
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
  async changeOwner(
    did: string,
    newOwner: string,
  ): Promise<boolean> {
    const tx = this._registry.interface.functions.changeOwner.encode([
      addressOf(did),
      addressOf(newOwner),
    ]);
    await this._send(tx);
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
  * const ownerKeys = new Keys();
  * const operator = new Operator(ownerKeys);
  * const updated = await operator.deactivate(did);
  * ```
  *
  * @param { string } did
  * @returns Promise<boolean>
  */
  async deactivate(did: string): Promise<void> {
    const document = await this.read(did);
    await this._revokeAuthentications(
      did,
      document.authentication as IAuthentication[],
      document.publicKey,
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
    publicKeys: IPublicKey[],
  ): Promise<void> {
    for await (const pk of publicKeys) {
      const match = pk.id.match(delegatePubKeyIdPattern);
      if (match) {
        const type = auths.find(
          (auth) => auth.publicKey === match[0],
        ) ? PubKeyType.SignatureAuthentication2018
          : PubKeyType.VerificationKey2018;
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
  protected async _revokePublicKeys(did: string, publicKeys: IPublicKey[]): Promise<void> {
    for await (const pk of publicKeys) {
      const match = pk.id.match(pubKeyIdPattern);
      if (match) {
        const encoding = Object.values(Encoding)
          .find((enc) => pk[encodedPubKeyName(enc)]) as Encoding;
        await this.revokeAttribute(
          did,
          DIDAttribute.PublicKey,
          {
            type: DIDAttribute.PublicKey,
            value: {
              id: pk.id,
              publicKey: pk[encodedPubKeyName(encoding)] as string,
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
  protected async _send(
    data: string,
  ): Promise<utils.BigNumber> {
    try {
      const tx = await this._owner.sendTransaction({
        data,
        to: this._registry.address,
      });
      const receipt = await tx.wait();
      return new BigNumber(receipt.blockNumber as number);
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
      algo, type, encoding,
    } = updateData;
    switch (attribute) {
      case DIDAttribute.PublicKey:
        return `did/${DIDAttribute.PublicKey}/${algo}/${type}/${encoding}`;
      case DIDAttribute.Authenticate:
        return updateData.type;
      case DIDAttribute.ServicePoint:
        return `did/${DIDAttribute.ServicePoint}/${(updateData.value as IAttributePayload).type}`;
      default:
        throw new Error('Unknown attribute name');
    }
  }
}
