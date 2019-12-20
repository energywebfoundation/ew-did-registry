import { Contract, ethers } from 'ethers';
import { IKeys } from '@ew-did-registry/keys';
import { IOperator, Resolver } from '../index';
import { IResolverSettings, ProviderTypes } from './index';

class Operator extends Resolver implements IOperator {
  /**
   * ERC-1056 compliant ethereum smart-contract
   */
  private _didRegistry: Contract;

  /**
   *
   */
  private readonly _keys: IKeys;

  /**
   * Ethereum blockchain provider
   */
  private readonly _provider: ethers.providers.BaseProvider;

  /**
   *
   * @param { IKeys } keys - identifies an account which acts as a
   * controller in a subsequent operations with DID document
   * @param { IResolverSettings } setting - blockchain provider setting
   */
  constructor(keys: IKeys, settings?: IResolverSettings) {
    super(settings);
    this._keys = keys;
    const {
      address, abi,
    } = this._settings;
    const { privateKey } = this._keys;
    this._provider = this._getProvider();
    const wallet = new ethers.Wallet(privateKey, this._provider);
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
    const id = did.split(':')[2];
    if (id !== document.id) {
      throw new Error('Document not active');
    }
    const invalidations: Array<Promise<boolean>> = [];
    Object.getOwnPropertyNames(document).forEach((p) => {
      invalidations.push(
        this._invalidate(did, p),
      );
    });
    const invalidated = await Promise.all(invalidations);
    return invalidated.reduce(
      (allInvalidated, current) => allInvalidated && current,
      true,
    );
  }

  private async _invalidate(did: string, attribute: string): Promise<boolean> {
    return this.update(did, attribute, '', 0);
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
    validity?: number,
  ): Promise<boolean> {
    const {
      identity,
      bytesOfAttribute,
      bytesOfValue,
    } = this.normalize(did, attribute, value);
    if (validity < 0) {
      throw new Error('Validity must be non negative value');
    }
    try {
      const tx = await this._didRegistry.setAttribute(
        identity,
        bytesOfAttribute,
        bytesOfValue,
        validity || ethers.constants.MaxUint256,
      );
      const receipt = await tx.wait();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const event = receipt.events.find((e: any) => e.event === 'DIDAttributeChanged');
      return !!event;
    } catch (e) {
      return false;
    }
  }

  private normalize(
    did: string,
    attribute: string,
    value: string | object,
  ): { identity: string; bytesOfAttribute: string; bytesOfValue: string } {
    const identity = did.split(':')[2];
    if (!identity) {
      throw new Error('Invalid DID');
    }
    const bytesOfAttribute = ethers.utils.formatBytes32String(attribute);
    const bytesOfValue = `0x${Buffer.from(typeof value === 'string'
      ? value
      : JSON.stringify(value))
      .toString('hex')}`;
    return {
      identity, bytesOfAttribute, bytesOfValue,
    };
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
}

export default Operator;
