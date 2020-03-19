/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, ethers, ContractFactory } from 'ethers';
import Web3 from 'web3';
import {
  DIDAttribute,
  IUpdateData,
  IResolverSettings,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';
import { IKeys } from '@ew-did-registry/keys';
import { id } from 'ethers/utils';
import {
  ethrReg,
} from '../constants';
import { Operator } from './operator';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../../../proxyIdentity/build/contracts/ProxyIdentity.json';

const { PublicKey, ServicePoint, Authenticate } = DIDAttribute;

export class ProxyOperator extends Operator {
  private contract: Contract;

  private proxy: Contract;

  private web3: Web3;

  constructor(keys: IKeys, settings: IResolverSettings, proxyAddress: Contract) {
    super(keys, settings);
    const { address, abi } = this.settings;
    const { privateKey } = keys;
    const wallet = new ethers.Wallet(privateKey, this._provider);
    this.contract = new Contract(address, abi, wallet);
    this.proxy = proxyAddress;
    this.web3 = new Web3('http://localhost:8544');
  }

  async revokeDelegate(
    identityDID: string,
    delegateType: PubKeyType,
    delegateDID: string,
  ): Promise<boolean> {
    const bytesType = ethers.utils.formatBytes32String(delegateType);
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = delegateDID.split(':');
    const params = [this.proxy.address, identityAddress, bytesType, delegateAddress];

    try {
      const signatureAbi: any = ethrReg.abi.find((f) => f.name === 'changeDelegate');
      const data: string = this.web3.eth.abi.encodeFunctionCall(signatureAbi, params);
      await this.proxy
        .sendTransaction(data, this.contract.address, 0)
        .then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

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
      const signatureAbi: any = ethrReg.abi.find((f) => f.name === 'changeAttribute');
      const data: string = this.web3.eth.abi.encodeFunctionCall(signatureAbi, params);
      await this.proxy
        .sendTransaction(data, this.contract.address, 0)
        .then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

  async changeOwner(identityDID: string, newOwnerDid: string): Promise<boolean> {
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = newOwnerDid.split(':');
    try {
      await this.proxy
        .changeOwner(delegateAddress)
        .then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

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
    const bytesOfAttribute = ethers.utils.formatBytes32String(didAttribute);
    const bytesOfValue = this._hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? updateData.value
        : updateData.delegate,
    );
    const params = [this.proxy.address, bytesOfAttribute, bytesOfValue, validity.toString()];
    let signature: string;
    if (didAttribute) {
      signature = 'setAttribute';
    } else {
      signature = 'addDelegate';
    }
    try {
      const signatureAbi: any = ethrReg.abi.find((f) => f.name === signature);
      const data: string = this.web3.eth.abi.encodeFunctionCall(signatureAbi, params);
      await this.proxy
        .sendTransaction(data, this.contract.address, 0)
        .then((tx: any) => tx.wait());
    } catch (error) {
      const signatureAbi: any = ethrReg.abi.find((f) => f.name === signature);
      throw new Error(error.message);
    }
    return true;
  }
}
