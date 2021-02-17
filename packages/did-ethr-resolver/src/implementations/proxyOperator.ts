/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, Event, utils } from 'ethers';
import {
  DIDAttribute,
  IUpdateData,
  PubKeyType,
  IAuthentication,
  IPublicKey,
  RegistrySettings,
  IdentityOwner,
} from '@ew-did-registry/did-resolver-interface';
import proxyBuild from '@ew-did-registry/proxyidentity/build/contracts/ProxyIdentity.json';
import {
  ethrReg,
} from '../constants';
import { Operator } from './operator';

const { BigNumber, Interface, formatBytes32String } = utils;

const { PublicKey, ServicePoint } = DIDAttribute;

export class ProxyOperator extends Operator {
  private proxy: Contract;

  private registry: Contract;

  /**
   *
   * @param owner - Signer connected to provider
   * @param settings - Settings to establish connection with Ethereum DID registry
   * @param proxy {string} - address of contract which proxies the identity
   */
  constructor(owner: IdentityOwner, settings: RegistrySettings, proxy: string) {
    super(owner, settings);
    this.proxy = new Contract(proxy, proxyBuild.abi, owner);
    this.registry = new Contract(this.settings.address, this.settings.abi, owner);
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
    try {
      await this._revokeAuthentications(
        did,
        document.authentication as IAuthentication[],
        document.publicKey as IPublicKey[],
      );
      await this._revokePublicKeys(did, document.publicKey);
      await this._revokeServices(did, document.service);
    } catch (e) {
      throw new Error(`Can't deactivate document: ${e.message}`);
    }
  }

  /**
   * Revokes the delegate from DID Document
   * Returns true on success
   *
   * @param { string } identityDID - did of identity of interest
   * @param { PubKeyType } delegateType - type of delegate of interest
   * @param { string } delegateDID - did of delegate of interest
   * @returns Promise<boolean>
   */
  async revokeDelegate(
    identityDID: string,
    delegateType: PubKeyType,
    delegateDID: string,
  ): Promise<boolean> {
    const bytesType = formatBytes32String(delegateType);
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = delegateDID.split(':');
    const params = [identityAddress, bytesType, delegateAddress];

    try {
      const data = new Interface(ethrReg.abi).functions.revokeDelegate.encode(params);
      await this.proxy
        .sendTransaction(data, this.settings.address, 0)
        .then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

  /**
   * Revokes the attribute from DID Document
   * Returns true on success
   *
   * @param { string } identityDID - did of identity of interest
   * @param { DIDAttribute } attributeType - type of attribute to revoke
   * @param { IUpdateData } updateData - data required to identify the correct attribute to revoke
   * @returns Promise<boolean>
   */
  async revokeAttribute(
    identityDID: string,
    attributeType: DIDAttribute,
    updateData: IUpdateData,
  ): Promise<boolean> {
    const [, , identityAddress] = identityDID.split(':');
    const attribute = this._composeAttributeName(attributeType, updateData);
    const bytesType = formatBytes32String(attribute);
    const bytesValue = this._hexify(updateData.value);
    const params = [identityAddress, bytesType, bytesValue];

    try {
      const data = new Interface(ethrReg.abi).functions.revokeAttribute.encode(params);
      await this.proxy
        .sendTransaction(data, this.settings.address, 0)
        .then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

  /**
   * Changes the owner of particular decentralised identity
   * Returns true on success
   *
   * @param { string } identityDID - did of current identity owner
   * @param { string } newOwnerDid - did of new owner that will be set on success
   * @returns Promise<boolean>
   */
  async changeOwner(identityDID: string, newOwnerDid: string): Promise<boolean> {
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = newOwnerDid.split(':');
    const params = [identityAddress, delegateAddress];
    try {
      const data = new Interface(ethrReg.abi).functions.changeOwner.encode(params);
      await this.proxy
        .sendTransaction(data, this.settings.address, 0)
        .then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

  /**
   * Function to send transactions to using proxy
   *
   * @param method
   * @param did
   * @param didAttribute
   * @param updateData
   * @param validity
   * @param overrides TODO: either use or remove
   * @protected
   */
  protected async _sendTransaction(
    method: Function,
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity?: number,
    overrides?: {
      nonce?: number;
    },
  ): Promise<utils.BigNumber> {
    const identity = this._parseDid(did);
    const attributeName = this._composeAttributeName(didAttribute, updateData);
    const bytesOfAttribute = formatBytes32String(attributeName);
    const bytesOfValue = this._hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? updateData.value
        : updateData.delegate,
    );
    const validityValue = validity !== undefined ? validity.toString() : '';
    const params = [identity, bytesOfAttribute, bytesOfValue, validityValue];
    let methodName: string;
    if (didAttribute === DIDAttribute.PublicKey || didAttribute === DIDAttribute.ServicePoint) {
      methodName = 'setAttribute';
    } else {
      methodName = 'addDelegate';
    }
    const data = new Interface(ethrReg.abi).functions[methodName].encode(params);
    let event: Event;
    try {
      const tx = await this.proxy.sendTransaction(data, this.settings.address, 0);
      const receipt = await tx.wait();
      event = receipt.events.find((e: Event) => e.event === 'TransactionSent');
      return new BigNumber(event.blockNumber);
    } catch (e) {
      throw new Error(`Can't send transaction: ${e.message}`);
    }
  }
}
