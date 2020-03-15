/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, ethers } from 'ethers';
import Web3 from 'web3';
import {
  DIDAttribute,
  IUpdateData,
  IResolverSettings,
  IAuthentication,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';
import { IKeys } from '@ew-did-registry/keys';
import { BlockTag } from 'ethers/providers';
import {
  ethrReg,
  abi1056,
  defaultProvider,
} from '../constants';
import { Operator } from './operator';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../constants/proxyIdentity.json';

const { PublicKey, ServicePoint, Authenticate } = DIDAttribute;

export class ProxyOperator extends Operator {
  private contract: Contract;

  private proxy: Contract;

  private web3: Web3;

  constructor(keys: IKeys, settings: IResolverSettings) {
    super(keys, settings);
    const { address, abi } = this.settings;
    const { privateKey } = keys;
    const wallet = new ethers.Wallet(privateKey, this._provider);
    this.contract = new Contract(address, abi, wallet);
    this.proxy = new Contract(address, proxyAbi, wallet);
    this.web3 = new Web3(defaultProvider.uriOrInfo);
  }

  async revokeDelegate(
    identityDID: string,
    delegateType: PubKeyType,
    delegateDID: string,
  ): Promise<boolean> {
    const bytesType = ethers.utils.formatBytes32String(delegateType);
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = delegateDID.split(':');
    const argumentsTypes = ['address', 'bytes32', 'address'];
    const passedArguments = [identityAddress, bytesType, delegateAddress];
    try {
      this.encodeProxyTransaction('DIDDelegateChanged', argumentsTypes, passedArguments);
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
    const argumentsTypes = ['address', 'bytes32', 'bytes'];
    const passedArguments = [identityAddress, bytesType, bytesValue];

    try {
      this.encodeProxyTransaction('DIDAttributeChanged', argumentsTypes, passedArguments);
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

  async changeOwner(
    identityDID: string,
    newOwnerDid: string,
  ): Promise<boolean> {
    console.log(identityDID, newOwnerDid);
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = newOwnerDid.split(':');
    const argumentsTypes = ['address', 'address', 'uint256'];
    const passedArguments = [identityAddress, delegateAddress, 1];
    try {
      this.encodeProxyTransaction('DIDOwnerChanged', argumentsTypes, passedArguments);
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
    const attributeName = this._composeAttributeName(didAttribute, updateData);
    const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
    const bytesOfValue = this._hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? updateData.value
        : updateData.delegate,
    );
    const passedArguments = [
      identity,
      bytesOfAttribute,
      bytesOfValue,
      validity,
    ];
    const argumentsTypes = ['address', 'bytes32', 'bytes', 'uint256'];
    try {
      let signature: string;
      if (didAttribute === PublicKey
        || didAttribute === Authenticate) {
        signature = 'setAttribute';
      } else {
        signature = 'addDelegate';
      }
      this.encodeProxyTransaction(signature, argumentsTypes, passedArguments);
    } catch (error) {
      throw new Error(error.message);
    }
    return true;
  }

  private encodeProxyTransaction(
    signature: string,
    argumentsTypes: Array<string>,
    passedArguments: Array<string | number>,
  ) {
    const web3AbiCoder = this.web3.eth.abi;
    const signatureAbi: any = ethrReg.abi.find((f) => f.name === signature);
    const parameters = argumentsTypes
      .map((type, i) => web3AbiCoder.encodeParameter(type, passedArguments[i]));
    const data: string = web3AbiCoder.encodeFunctionCall(signatureAbi, parameters);
    this.proxy.sendTransaction(data, this.contract.address).then((tx: any) => tx.wait());
  }
}
