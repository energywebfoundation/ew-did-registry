/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, ethers } from 'ethers';
import Web3 from 'web3';
import {
  DIDAttribute,
  IUpdateData,
  IResolverSettings,
  PubKeyType,
  IAuthentication,
  IPublicKey,
} from '@ew-did-registry/did-resolver-interface';
import { IKeys } from '@ew-did-registry/keys';
import proxyBuild from '@ew-did-registry/proxyidentity/build/contracts/ProxyIdentity.json';
import {
  ethrReg,
} from '../constants';
import { DefaultOperator } from './defaultOperator';

const { PublicKey, ServicePoint } = DIDAttribute;

export class ProxyOperator extends DefaultOperator {
  private proxy: Contract;

  private web3: Web3;

  /**
   *
   * @param keys
   * @param settings
   * @param proxyAddress {string} - address of proxy smart contract representing identity
   */
  constructor(keys: IKeys, settings: IResolverSettings, proxyAddress: string) {
    super(keys, settings);
    const { privateKey } = keys;
    const wallet = new ethers.Wallet(privateKey, this._provider);
    this.proxy = new Contract(proxyAddress, proxyBuild.abi, wallet);
    this.web3 = new Web3('http://localhost:8544');
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
  async deactivate(did: string): Promise<boolean> {
    const document = await this.read(did);
    const authRevoked = await this._revokeAuthentications(
      did,
      document.authentication as IAuthentication[],
      document.publicKey as IPublicKey[],
    );
    const pubKeysRevoked = await this._revokePublicKeys(did, document.publicKey);
    const endpointsRevoked = await this._revokeServices(did, document.service);
    return authRevoked && pubKeysRevoked && endpointsRevoked;
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
    const bytesType = ethers.utils.formatBytes32String(delegateType);
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = delegateDID.split(':');
    const params = [identityAddress, bytesType, delegateAddress];

    try {
      const signatureAbi: any = ethrReg.abi.find((f) => f.name === 'revokeDelegate');
      const data: string = this.web3.eth.abi.encodeFunctionCall(signatureAbi, params);
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
    const bytesType = ethers.utils.formatBytes32String(attribute);
    const bytesValue = this._hexify(updateData.value);
    const params = [identityAddress, bytesType, bytesValue];

    try {
      const signatureAbi: any = ethrReg.abi.find((f) => f.name === 'revokeAttribute');
      const data: string = this.web3.eth.abi.encodeFunctionCall(signatureAbi, params);
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
      const changeOwnerAbi: any = ethrReg.abi.find((f) => f.name === 'changeOwner');
      const data: string = this.web3.eth.abi.encodeFunctionCall(changeOwnerAbi, params);
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
   * @param overrides
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
  ): Promise<boolean> {
    const identity = this._parseDid(did);
    const attributeName = this._composeAttributeName(didAttribute, updateData);
    const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
    const bytesOfValue = this._hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? updateData.value
        : updateData.delegate,
    );
    const validityValue = validity !== null ? validity.toString() : '';
    const params = [identity, bytesOfAttribute, bytesOfValue, validityValue];
    let methodName: string;
    if (didAttribute === DIDAttribute.PublicKey || didAttribute === DIDAttribute.ServicePoint) {
      methodName = 'setAttribute';
    } else {
      methodName = 'addDelegate';
    }
    try {
      const methodAbi: any = ethrReg.abi.find((f) => f.name === methodName);
      const data: string = this.web3.eth.abi.encodeFunctionCall(methodAbi, params);
      await this.proxy
        .sendTransaction(data, this.settings.address, 0)
        .then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error.message);
    }
    return true;
  }
}
