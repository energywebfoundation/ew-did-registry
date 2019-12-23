/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, ethers, Wallet } from 'ethers';
import { IKeys } from '@ew-did-registry/keys';
import { BigNumber } from 'ethers/utils';
import { IOperator, Resolver } from '../index';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IPublicKey,
  IServiceEndpoint,
  IUpdateData,
  ProviderTypes,
  PubKeyType,
} from './index';
import {
  delegatePubKeyIdPattern,
  matchingPatternDid,
  pubKeyIdPattern,
  serviceIdPattern,
} from '../constants';

const { Authenticate, PublicKey, ServicePoint } = DIDAttribute;

class Operator extends Resolver implements IOperator {
  /**
   * ERC-1056 compliant ethereum smart-contract
   */
  private _didRegistry: Contract;

  /**
   *
   */
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
   * Empty for current implementation
   * @param did
   * @param context
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(did: string, context: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  /**
   * Sets attribute value in Did document identified by the did
   *
   * @example
   *```typescript
   *import { Operator, ProviderTypes } from '@ew-did-registry/did-resolver';
   *import { Keys } from '@ew-did-registry/keys';
   *
   * const keys = new Keys();
   * const resolverSettings = {
   * abi, // abi of the ERC1056 compliant smart-contract
   * address, // ethereum address of the smart-contract
   *   provider: {
   *     uri: 'https://volta-rpc.energyweb.org/',
   *     type: ProviderTypes.HTTP,
   *   }
   * };
   * const operator = new Operator(keys, resolverSettings);
   * const updated = operator.update(did, Attributes.service, "DrivingLicense");
   * ```
   *
   * @param { string } did - did associated with DID document
   * @param { string } attribute - attribute name. Must be 31 bytes or shorter
   * @param { string|object } value - attribute value
   * @param { number } validity - time in milliseconds during which
   *                              attribute will be valid
   *
   * @return Promise<boolean>
   */
  async update(
    did: string,
    attribute: string,
    value: string | object,
    validity: number | BigNumber = ethers.constants.MaxUint256,
  ): Promise<boolean> {
    const updateData = value as IUpdateData;
    const didAttribute = attribute as DIDAttribute;
    const attributeName = Operator._composeAttributeName(didAttribute, updateData);
    const identity = Operator._parseDid(did);
    const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
    const bytesOfValue = this._hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? updateData.value
        : updateData.delegate,
    );
    if (validity < 0) {
      throw new Error('Validity must be non negative value');
    }
    const registry = this._didRegistry;
    const updateMethod = didAttribute === PublicKey || didAttribute === ServicePoint
      ? registry.setAttribute
      : registry.addDelegate;
    console.log(`attribute name:${attributeName}`);
    console.log('update data:', updateData);
    // console.log('bytes of attr name:', bytesOfAttribute);
    // console.log('bytes of attr value:', bytesOfValue);
    try {
      const tx = await updateMethod(
        identity,
        bytesOfAttribute,
        bytesOfValue,
        validity,
      );
      const receipt = await tx.wait();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // console.log('update receipt:', receipt);
      const event = receipt.events.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) => (e.event === 'DIDAttributeChanged' && attributeName === PublicKey)
          || (e.event === 'DIDAttributeChanged' && didAttribute === ServicePoint)
          || (e.event === 'DIDDelegateChanged' && didAttribute === Authenticate)
        ,
      );
      // console.log('update event: ', event);
      return !!event;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Revokes specified attribute from DID document
   *
   * @example
   * ```typescript
   *import { Operator, ProviderTypes } from '@ew-did-registry/did-resolver';
   *import { Keys } from '@ew-did-registry/keys';
   *
   * const keys = new Keys();
   * const resolverSettings = {
   * abi, // abi of the ERC1056 compliant smart-contract
   * address, // ethereum address of the smart-contract
   *   provider: {
   *     uri: 'https://volta-rpc.energyweb.org/',
   *     type: ProviderTypes.HTTP,
   *   }
   * };
   * const operator = new Operator(keys, resolverSettings);
   * const updated = operator.deactivate(did);
   * ```
   *
   * @param { string } did
   */
  async deactivate(did: string): Promise<boolean> {
    const document = await this.read(did);
    const authRevoked = await this._revokeAuthentications(
      did, document.authentication as string[],
    );
    // const pubKeysRevoked = await this._revokePublicKeys(did, document.publicKey);
    // const endpointsRevoked = await this._revokeServices(did, document.service);
    // return authRevoked && pubKeysRevoked && endpointsRevoked;
    return true;
  }

  private async _revokeAuthentications(did: string, auths: string[]): Promise<boolean> {
    const sender = this._wallet.address;
    let nonce = await this._didRegistry.provider.getTransactionCount(sender);
    console.log('nonce=', nonce);
    // eslint-disable-next-line no-restricted-syntax
    for (const auth of auths) {
      console.log('auth:', auth);
      const match = auth.match(delegatePubKeyIdPattern);
      // eslint-disable-next-line no-continue
      if (!match) continue;
      const delegateAddress = match[1];
      console.log('delegate address:', delegateAddress);
      const didAttribute = DIDAttribute.Authenticate;
      const updateData: IUpdateData = {
        algo: Algorithms.ED25519,
        type: PubKeyType.SignatureAuthentication2018,
        encoding: Encoding.HEX,
        delegate: delegateAddress,
      };
      const identity = Operator._parseDid(did);
      const attributeName = Operator._composeAttributeName(didAttribute, updateData);
      const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
      const bytesOfValue = this._hexify(updateData.delegate);
      try {
        const tx = await this._didRegistry.revokeDelegate(
          identity,
          bytesOfAttribute,
          bytesOfValue,
          {
            nonce,
          },
        );
        const receipt = await tx.wait();
        const event = receipt.events.find(
          (e: any) => (e.event === 'DIDDelegateChanged'),
        );
        console.log('store delegate event into block:', event.blockNumber);
      } catch (e) {
        console.error(e);
        return false;
      }
      nonce += 1;
    }
    return true;
  }

  private async _revokePublicKeys(did: string, publicKeys: IPublicKey[]): Promise<boolean> {
    for (const pk of publicKeys) {
      console.log('pk.id=', pk.id);
      const match = pk.id.match(pubKeyIdPattern);
      console.log('match of pub key:', match);
      // eslint-disable-next-line no-continue
      if (!match) continue;
      const type = match[1];
      const didAttribute = DIDAttribute.PublicKey;
      const encodings = Object.values(Encoding);
      const encoding = encodings.find((e) => {
        const suffix = `${e[0].toUpperCase()}${e.slice(1)}`;
        return pk[`publicKey${suffix}`];
      });
      console.log('encoding:', encoding);
      if (!encoding) {
        throw new Error('Unknown encoding');
      }
      const value = pk[`publicKey${encoding[0].toUpperCase()}${encoding.slice(1)}`];
      console.log('value of pub key:', value);
      const updateData: IUpdateData = {
        algo: Algorithms.ED25519,
        type: match[1] as PubKeyType,
        encoding,
        value,
      };
      const identity = Operator._parseDid(did);
      const attributeName = Operator._composeAttributeName(didAttribute, updateData);
      const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
      const bytesOfValue = this._hexify(updateData.value);
      const sender = this._wallet.address;
      let nonce = await this._didRegistry.provider.getTransactionCount(sender);
      try {
        const tx = await this._didRegistry.revokeAttribute(
          identity,
          bytesOfAttribute,
          bytesOfValue,
          {
            nonce,
          },
        );
        const receipt = await tx.wait();
        const event = receipt.events.find(
          (e: any) => (e.event === 'DIDAttributeChanged'),
        );
      } catch (e) {
        console.error(e);
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
      const algo = match[1];
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
    const identity = Operator._parseDid(did);
    const attributeName = Operator._composeAttributeName(didAttribute, updateData);
    const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
    const bytesOfValue = this._hexify(updateData.value);
    const sender = this._wallet.address;
    console.log('validity || overrides:', validity || overrides);
    console.log('validity && overrides:', validity && overrides);
    // try {
    //   const tx = await method(
    //     identity,
    //     bytesOfAttribute,
    //     bytesOfValue,
    //     validity || overrides,
    //     validity && overrides,
    //   );
    //   const receipt = await tx.wait();
    //   const event = receipt.events.find(
    //     (e: any) => (e.event === 'DIDAttributeChanged'),
    //   );
    // } catch (e) {
    //   console.error(e);
    //   return false;
    // }
    return true;
  }

  private static _composeAttributeName(attribute: DIDAttribute, updateData: IUpdateData): string {
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
        return new ethers.providers.JsonRpcProvider(provider.uri);
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

export default Operator;
