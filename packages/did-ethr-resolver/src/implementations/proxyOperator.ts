/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, ethers } from 'ethers';
import {
  // DIDAttribute,
  // IUpdateData,
  IResolverSettings,
} from '@ew-did-registry/did-resolver-interface';
import { IKeys } from '@ew-did-registry/keys';
import { ethrReg } from '../constants';
import { Operator } from './operator';

// const { PublicKey, ServicePoint } = DIDAttribute;

export class ProxyOperator extends Operator {
  private contract: Contract;

  private proxy: Contract;

  constructor(keys: IKeys, settings: IResolverSettings) {
    super(keys, settings);
    const { address, abi } = this.settings;
    const { privateKey } = keys;
    const wallet = new ethers.Wallet(privateKey, this._provider);
    this.contract = new Contract(address, abi, wallet);
    this.proxy = new Contract(address, abi, wallet);
  }

  protected async _sendTransaction(
  // method: Function,
  // did: string,
  // didAttribute: DIDAttribute,
  // updateData: IUpdateData,
  // validity?: number,
  // overrides?: {
  //   nonce?: number;
  // },
  ): Promise<boolean> {
    // const identity = this.contract._parseDid(did);
    // const attributeName = this.contract._composeAttributeName(didAttribute, updateData);
    // const bytesOfAttribute = ethers.utils.formatBytes32String(attributeName);
    // const bytesOfValue = this.contract._hexify(
    // didAttribute === PublicKey || didAttribute === ServicePoint
    // ? updateData.value
    // : updateData.delegate,
    // );
    // const argums = [identity,
    //   bytesOfAttribute,
    //   bytesOfValue,
    //   validity || overrides,
    //   validity && overrides,
    // ];
    try {
      const setAttributeAbi: any = ethrReg.abi.find((f) => f.name === 'setAttribute');
      const attribute: string = ethers.utils.defaultAbiCoder.coerceFunc('bytes32', ethers.utils.namehash('name'));
      const value: string = ethers.utils.defaultAbiCoder.coerceFunc('bytes', ethers.utils.namehash('John'));
      const data: string = ethers.utils.defaultAbiCoder.encode(setAttributeAbi, [this.proxy.address, attribute, value, '1000']);
      this.proxy.sendTransaction(data, this.contract.address).then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error.message);
    }
    return true;
  }
}
