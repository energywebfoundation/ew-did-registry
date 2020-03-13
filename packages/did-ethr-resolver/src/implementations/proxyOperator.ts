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
      validity && overrides,
    ];
    const argumentsTypes = ['address', 'address', 'address', 'int256', 'bytes'];
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

  // protected async _revokeAuthentications(
  //   did: string,
  //   auths: IAuthentication[],
  //   publicKeys: IPublicKey[],
  // ): Promise<boolean> {
  //   const sender = this._wallet.address;
  // let nonce = await this.contract.provider.getTransactionCount(sender);
  //   // eslint-disable-next-line no-restricted-syntax
  //   const method = this.contract.revokeDelegate;
  //   for (const pk of publicKeys) {
  //     const match = pk.id.match(delegatePubKeyIdPattern);
  //     // eslint-disable-next-line no-continue
  //     if (!match) continue;
  //     const didAttribute = Authenticate;
  //     const delegateAddress = pk.ethereumAddress;
  //     const updateData: IUpdateData = {
  //       algo: Algorithms.ED25519,
  //       type: auths.find(
  //         (auth) => auth.publicKey === match[0],
  //       ) ? PubKeyType.SignatureAuthentication2018
  //         : PubKeyType.VerificationKey2018,
  //       encoding: Encoding.HEX,
  //       delegate: delegateAddress,
  //     };
  //     const revoked = await this._sendTransaction(
  //       method, did, didAttribute, updateData, null, { nonce },
  //     );
  //     if (!revoked) {
  //       return false;
  //     }
  //     nonce += 1;
  //   }
  //   return true;
  // }

  //   protected async _revokePublicKeys(did: string, publicKeys: IPublicKey[]): Promise<boolean> {
  //     const sender = this._wallet.address;
  //     let nonce = await this.contract.provider.getTransactionCount(sender);
  //     for (const pk of publicKeys) {
  //       const match = pk.id.match(pubKeyIdPattern);
  //       // eslint-disable-next-line no-continue
  //       if (!match) continue;
  //       const didAttribute = DIDAttribute.PublicKey;
  //       const encodings = Object.values(Encoding);
  //       const encoding = encodings.find((e) => {
  //         const suffix = `${e[0].toUpperCase()}${e.slice(1)}`;
  //         return pk[`publicKey${suffix}`];
  //       });
  //       if (!encoding) {
  //         throw new Error('Unknown encoding');
  //       }
  //       const value = pk[`publicKey${encoding[0].toUpperCase()}${encoding.slice(1)}`] as string;
  //       const updateData: IUpdateData = {
  //         algo: match[1] as Algorithms,
  //         type: match[2] as PubKeyType,
  //         encoding,
  //         value,
  //       };
  //       const method = this.contract.revokeAttribute;
  //       const revoked = await this._sendTransaction(
  //         method, did, didAttribute, updateData, null, { nonce },
  //       );
  //       if (!revoked) {
  //         return false;
  //       }
  //       nonce += 1;
  //     }
  //     return true;
  //   }

  // protected async _revokeServices(did: string, services: IServiceEndpoint[]): Promise<boolean> {
  //   const sender = this._wallet.address;
  // //     let nonce = await this.contract.provider.getTransactionCount(sender);
  // //     for (const service of services) {
  // //       const match = service.id.match(serviceIdPattern);
  // //       const type = match[1] as PubKeyType;
  // //       const value = service.serviceEndpoint;
  // //       const didAttribute = DIDAttribute.ServicePoint;
  // //       const revoked = await this._sendTransaction(
  // //         this.contract.revokeAttribute,
  // //         did,
  // //         didAttribute,
  // //         {
  // //           type, value,
  // //         },
  // //         null,
  // //         { nonce },
  // //       );
  // //       if (!revoked) {
  // //         return false;
  // //       }
  // //       nonce += 1;
  // //     }
  // //     return true;
  // //   }
}
