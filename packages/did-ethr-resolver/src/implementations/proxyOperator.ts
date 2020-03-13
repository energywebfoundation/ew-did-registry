/* eslint-disable no-await-in-loop,no-restricted-syntax */
import { Contract, ethers } from 'ethers';
import {
  DIDAttribute,
  IUpdateData,
  IResolverSettings,
  IAuthentication,
  // IPublicKey,
  // Algorithms,
  // PubKeyType,
  // Encoding,
  // IServiceEndpoint,
} from '@ew-did-registry/did-resolver-interface';
import { IKeys } from '@ew-did-registry/keys';
import {
  ethrReg,
  // delegatePubKeyIdPattern, pubKeyIdPattern, serviceIdPattern,
} from '../constants';
import { Operator } from './operator';

const { PublicKey, ServicePoint, Authenticate } = DIDAttribute;

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
      validity || overrides,
    ];
    const argumentsTypes = ['address', 'bytes32', 'bytes', 'int256'];
    try {
      let signature: string;
      if (didAttribute === PublicKey
        || didAttribute === Authenticate) {
        signature = 'setAttribute';
      }
      signature = 'addDelegate';
      const signatureAbi: any = ethrReg.abi.find((f) => f.name === signature);
      const attribute: string = ethers.utils.defaultAbiCoder.encode(
        argumentsTypes,
        passedArguments,
      );
      const data: string = ethers.utils.defaultAbiCoder.encode(
        signatureAbi,
        [attribute],
      );
      this.proxy.sendTransaction(data, this.contract.address).then((tx: any) => tx.wait());
    } catch (error) {
      throw new Error(error.message);
    }
    return true;
  }
}
