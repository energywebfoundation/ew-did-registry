/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, ethers, Wallet } from 'ethers';
import { IKeys } from '@ew-did-registry/keys';
import { BigNumber } from 'ethers/utils';
import { IOperator } from '../interface';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IAuthentication,
  IPublicKey,
  IServiceEndpoint,
  IUpdateData,
  ProviderTypes,
  PubKeyType,
} from '../models';
import Resolver from './resolver';
import {
  delegatePubKeyIdPattern,
  matchingPatternDid,
  pubKeyIdPattern,
  serviceIdPattern,
} from '../constants';

const { Authenticate, PublicKey, ServicePoint } = DIDAttribute;

export class Operator extends Resolver implements IOperator {
  /**
   * ERC-1056 compliant ethereum smart-contract
   */
  private _didRegistry: Contract;

  private readonly _keys: IKeys;

  private readonly _wallet: Wallet;

  /**
   * Ethereum blockchain provider
   */
  private readonly _provider: ethers.providers.BaseProvider;

  /**
   *
   * @param { IKeys } keys - identifies an account which acts as a
   * controller in a subsequent operations with DID document
   */
  constructor(keys: IKeys) {
    super();
    this._keys = keys;
    const {
      address, abi,
    } = this._settings;
    const { privateKey } = this._keys;
    this._provider = this._getProvider();
    const wallet = new ethers.Wallet(privateKey, this._provider);
    this._wallet = wallet;
    this._didRegistry = new ethers.Contract(address, abi, wallet);
  }

  /**
   * Empty for this implementation
   * @param did
   * @param context
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(did: string, context: string): Promise<boolean> {
    return Promise.resolve(true);
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
   * @param { DIDAttribute } didAttribute - specifies updated section in DID document. Must be 31
   * bytes or shorter
   * @param { IUpdateData } updateData
   * @param { number } validity - time in milliseconds during which
   *                              attribute will be valid
   *
   * @return Promise<boolean>
   */
  async update(
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity: number | BigNumber = ethers.constants.MaxUint256,
  ): Promise<boolean> {
    const registry = this._didRegistry;
    const method = didAttribute === PublicKey || didAttribute === ServicePoint
      ? registry.setAttribute
      : registry.addDelegate;
    return this._sendTransaction(method, did, didAttribute, updateData, validity);
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
   */
  async deactivate(did: string): Promise<boolean> {
    const document = await this.read(did);
    const authRevoked = await this._revokeAuthentications(
      did,
      document.authentication as IAuthentication[],
      document.publicKey,
    );
    const pubKeysRevoked = await this._revokePublicKeys(did, document.publicKey);
    const endpointsRevoked = await this._revokeServices(did, document.service);
    return authRevoked && pubKeysRevoked && endpointsRevoked;
  }

  private async _revokeAuthentications(
    did: string,
    auths: IAuthentication[],
    publicKeys: IPublicKey[],
  ): Promise<boolean> {
    const sender = this._wallet.address;
    let nonce = await this._didRegistry.provider.getTransactionCount(sender);
    // eslint-disable-next-line no-restricted-syntax
    const method = this._didRegistry.revokeDelegate;
    for (const pk of publicKeys) {
      const match = pk.id.match(delegatePubKeyIdPattern);
      // eslint-disable-next-line no-continue
      if (!match) continue;
      const didAttribute = Authenticate;
      const delegateAddress = pk.ethereumAddress;
      const updateData: IUpdateData = {
        algo: Algorithms.ED25519,
        type: auths.find(
          (auth) => auth.publicKey === match[0],
        ) ? PubKeyType.SignatureAuthentication2018
          : PubKeyType.VerificationKey2018,
        encoding: Encoding.HEX,
        delegate: delegateAddress,
      };
      const revoked = await this._sendTransaction(
        method, did, didAttribute, updateData, null, { nonce },
      );
      if (!revoked) {
        return false;
      }
      nonce += 1;
    }
    return true;
  }

  private async _revokePublicKeys(did: string, publicKeys: IPublicKey[]): Promise<boolean> {
    const sender = this._wallet.address;
    let nonce = await this._didRegistry.provider.getTransactionCount(sender);
    for (const pk of publicKeys) {
      const match = pk.id.match(pubKeyIdPattern);
      // eslint-disable-next-line no-continue
      if (!match) continue;
      const didAttribute = DIDAttribute.PublicKey;
      const encodings = Object.values(Encoding);
      const encoding = encodings.find((e) => {
        const suffix = `${e[0].toUpperCase()}${e.slice(1)}`;
        return pk[`publicKey${suffix}`];
      });
      if (!encoding) {
        throw new Error('Unknown encoding');
      }
      const value = pk[`publicKey${encoding[0].toUpperCase()}${encoding.slice(1)}`] as string;
      const updateData: IUpdateData = {
        algo: Algorithms.ED25519,
        type: match[1] as PubKeyType,
        encoding,
        value,
      };
      const method = this._didRegistry.revokeAttribute;
      const revoked = await this._sendTransaction(
        method, did, didAttribute, updateData, null, { nonce },
      );
      if (!revoked) {
        return false;
      }
      nonce += 1;
    }
    return true;
  }

  private async _revokeServices(did: string, services: IServiceEndpoint[]): Promise<boolean> {
    let revoked = true;
    const sender = this._wallet.address;
    let nonce = await this._didRegistry.provider.getTransactionCount(sender);
    for (const service of services) {
      const match = service.id.match(serviceIdPattern);
      const algo = match[1] as Algorithms;
      const value = service.serviceEndpoint;
      const didAttribute = DIDAttribute.ServicePoint;
      revoked = revoked && await this._sendTransaction(
        this._didRegistry.revokeAttribute,
        did,
        didAttribute,
        {
          algo, type: PubKeyType.VerificationKey2018, encoding: Encoding.HEX, value,
        },
        null,
        { nonce },
      );
      nonce += nonce;
    }
    return revoked;
  }

  private async _sendTransaction(
    method: any,
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity?: number | BigNumber,
    overrides?: {
      nonce?: number;
    },
  ): Promise<boolean> {
    if (validity && validity < 0) {
      throw new Error('Validity must be non negative value');
    }
    const identity = Operator._parseDid(did);
    const attributeName = this._composeAttributeName(didAttribute, updateData);
    const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
    const bytesOfValue = this._hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? updateData.value
        : updateData.delegate,
    );
    const argums = [identity,
      bytesOfAttribute,
      bytesOfValue,
      validity || overrides,
      validity && overrides,
    ];
    try {
      const tx = await method(...argums.filter((a) => a));
      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: any) => (didAttribute === DIDAttribute.PublicKey && e.event === 'DIDAttributeChanged')
          || (didAttribute === DIDAttribute.ServicePoint && e.event === 'DIDAttributeChanged')
          || (didAttribute === DIDAttribute.Authenticate && e.event === 'DIDDelegateChanged'),
      );
      if (!event) return false;
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  private _composeAttributeName(attribute: DIDAttribute, updateData: IUpdateData): string {
    const {
      algo, type, encoding,
    } = updateData;
    switch (attribute) {
      case DIDAttribute.PublicKey:
        return `did/${DIDAttribute.PublicKey}/${algo}/${type}/${encoding}`;
      case DIDAttribute.Authenticate:
        return updateData.type;
      case DIDAttribute.ServicePoint:
        return `did/${DIDAttribute.ServicePoint}/${algo}/${type}/${encoding}`;
      default:
        throw new Error('Unknown attribute name');
    }
  }

  private _hexify(value: string | object): string {
    if (typeof value === 'string' && value.startsWith('0x')) {
      return value;
    }
    return `0x${Buffer.from(typeof value === 'string'
      ? value
      : JSON.stringify(value))
      .toString('hex')}`;
  }

  private _getProvider(): ethers.providers.JsonRpcProvider | ethers.providers.BaseProvider {
    const { provider } = this._settings;
    switch (provider.type) {
      case ProviderTypes.HTTP:
        return new ethers.providers.JsonRpcProvider(provider.uriOrInfo, provider.network);
      case ProviderTypes.IPC:
        return new ethers.providers.IpcProvider(provider.path, provider.network);
      default:
        return ethers.getDefaultProvider();
    }
  }

  private static _parseDid(did: string): string {
    if (!matchingPatternDid.test(did)) {
      throw new Error('Invalid DID');
    }
    const [, , id] = did.split(':');
    return id;
  }
}
