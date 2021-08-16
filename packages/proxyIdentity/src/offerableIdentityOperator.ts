import {
  Contract, utils, BigNumber,
} from 'ethers';
import {
  DIDAttribute,
  IUpdateData,
  RegistrySettings,
  IUpdateAttributeData,
  IUpdateDelegateData,
} from '@ew-did-registry/did-resolver-interface';
import {
  Operator, IdentityOwner, hexify, addressOf,
} from '@ew-did-registry/did-ethr-resolver';
import { abi as identityAbi } from '../build/contracts/OfferableIdentity.json';
import { abi as erc1056Abi } from '../constants/ERC1056.json';

const { Interface, formatBytes32String } = utils;
const { PublicKey, ServicePoint } = DIDAttribute;

export class OfferableIdenitytOperator extends Operator {
  private identity: Contract;

  /**
   *
   * @param owner - Owner of the identity
   * @param settings - Settings to connect to Ethr registry
   * @param identityAddr - Address of controlled offerable identity
   */
  constructor(
    owner: IdentityOwner,
    settings: RegistrySettings,
    identityAddr: string,
  ) {
    super(owner, settings);
    this.identity = new Contract(identityAddr, identityAbi, owner);
  }

  async revokeDelegate(): Promise<boolean> {
    throw new Error('Not supported');
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async changeOwner(
    identityDID: string,
    newOwnerDid: string,
  ): Promise<boolean> {
    throw new Error('Not supported');
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  /**
   * @todo
   */
  async deactivate(): Promise<void> {
    throw new Error('Not supported yet');
  }

  protected async getAddress(): Promise<string> {
    return this.identity.address;
  }

  async offer(offerTo: string): Promise<boolean> {
    await this.identity.offer(
      new Interface(identityAbi).encodeFunctionData('offer', [offerTo]),
      this.settings.address,
      0,
    );
    return true;
  }

  protected async _sendTransaction(
    method: (...args: (string | number | Record<string, unknown>)[]) => Promise<void>,
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity?: number,
  ): Promise<BigNumber> {
    const identity = addressOf(did);
    const attributeName = this._composeAttributeName(didAttribute, updateData);
    const bytesOfAttribute = formatBytes32String(attributeName);
    const bytesOfValue = hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? (updateData as IUpdateAttributeData).value
        : (updateData as IUpdateDelegateData).delegate,
    );
    const validityValue = validity !== undefined ? validity.toString() : '';
    const params = [identity, bytesOfAttribute, bytesOfValue, validityValue];
    let methodName: string;
    if (didAttribute === DIDAttribute.PublicKey || didAttribute === DIDAttribute.ServicePoint) {
      methodName = 'setAttribute';
    } else {
      methodName = 'addDelegate';
    }
    const data = new Interface(erc1056Abi).encodeFunctionData(methodName, params);
    try {
      const tx = await this.identity.sendTransaction(this._contract.address, data, 0);
      const receipt = await tx.wait();
      return BigNumber.from(receipt.blockNumber);
    } catch (e) {
      throw new Error(e);
    }
  }
}
