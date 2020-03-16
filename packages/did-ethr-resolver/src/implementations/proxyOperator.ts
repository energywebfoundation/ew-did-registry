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
import {
  ethrReg,
  abi1056,
  defaultProvider,
} from '../constants';
import { Operator } from './operator';
import { abi as proxyAbi } from '../../../proxyIdentity/build/contracts/ProxyIdentity.json';

const { PublicKey, ServicePoint, Authenticate } = DIDAttribute;

export class ProxyOperator extends Operator {
  private contract: Contract;

  private proxy: Contract;

  private web3: Web3;

  constructor(keys: IKeys, settings: IResolverSettings, proxyFactory: Contract = null) {
    super(keys, settings);
    const { address, abi } = this.settings;
    const { privateKey } = keys;
    const wallet = new ethers.Wallet(privateKey, this._provider);
    this.contract = new Contract(address, abi, wallet);
    this.proxy = new Contract(proxyFactory.address, proxyAbi, wallet);
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

    const passedArguments = {
      identity: { value: identityAddress, type: 'address' },
      bytesType: { value: bytesType, type: 'bytes32' },
      delegate: { value: delegateAddress, type: 'address' },
    };
    try {
      this.encodeProxyTransaction('changeDelegate', passedArguments);
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
    const passedArguments = {
      identity: { value: identityAddress, type: 'address' },
      bytesType: { value: bytesType, type: 'bytes32' },
      bytesValue: { value: bytesValue, type: 'bytes' },
    };

    try {
      this.encodeProxyTransaction('changeAttribute', passedArguments);
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

  async changeOwner(
    identityDID: string,
    newOwnerDid: string,
  ): Promise<boolean> {
    const [, , identityAddress] = identityDID.split(':');
    const [, , delegateAddress] = newOwnerDid.split(':');
    const passedArguments = {
      identity: { value: identityAddress, type: 'address' },
      delegate: { value: delegateAddress, type: 'address' },
      val: { value: 0, type: 'int' },
    };
    try {
      this.encodeProxyTransaction('changeOwner', passedArguments);
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

    const passedArguments = {
      identity: { value: identity, type: 'address' },
      bytesOfAttribute: { value: bytesOfAttribute, type: 'bytes32' },
      bytesOfValue: { value: bytesOfValue, type: 'bytes' },
      validity: { value: validity, type: 'uint256' },
    };

    try {
      let signature: string;
      if (didAttribute === PublicKey
        || didAttribute === Authenticate) {
        signature = 'setAttribute';
      } else {
        signature = 'addDelegate';
      }
      const et = await this.encodeProxyTransaction(signature, passedArguments, overrides);
    } catch (error) {
      throw new Error(error.message);
    }
    return true;
  }

  private async encodeProxyTransaction(
    signature: string,
    passedArguments: any,
    overrides?: {
      nonce?: number;
    },
  ) {
    const web3AbiCoder = this.web3.eth.abi;
    const signatureAbi: any = ethrReg.abi.find((f) => f.name === signature);

    const parameters = Object
      .keys(passedArguments)
      .map((passedArg) => {
        const arg = passedArguments[passedArg];
        if (arg.type !== 'address') {
          web3AbiCoder.encodeParameter(arg.type, arg.value);
        }
        return arg.value;
      });

    const data: string = web3AbiCoder.encodeFunctionCall(signatureAbi, parameters);
    const trx = await this.proxy
      .sendTransaction(data, this.contract.address, 1)
      .then((tx: any) => tx.wait());
    console.log(trx);
    return trx;
  }
}
