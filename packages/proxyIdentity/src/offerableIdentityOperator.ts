import { Contract, utils, BigNumber } from 'ethers';
import {
  DIDAttribute,
  IUpdateData,
  RegistrySettings,
  IUpdateAttributeData,
  IUpdateDelegateData,
} from '@ew-did-registry/did-resolver-interface';
import {
  Operator,
  EwSigner,
  hexify,
  addressOf,
} from '@ew-did-registry/did-ethr-resolver';
import { abi as identityAbi } from '../build/contracts/OfferableIdentity.json';
import { abi as erc1056Abi } from '../constants/ERC1056.json';
import { OnlyOwnerAllowed } from './errors';

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
    private owner: EwSigner,
    settings: RegistrySettings,
    identityAddr: string
  ) {
    super(owner, settings);
    this.identity = new Contract(identityAddr, identityAbi, owner);
  }

  async revokeDelegate(): Promise<boolean> {
    throw new Error('Not supported');
  }

  async getOwnerAddress() {
    return this.owner.getAddress();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async changeOwner(
    identityDID: string,
    newOwnerDid: string
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
      0
    );
    return true;
  }

  protected async _sendTransaction(
    method: string,
    did: string,
    didAttribute: DIDAttribute,
    updateData: IUpdateData,
    validity?: number
  ): Promise<BigNumber> {
    const identity = addressOf(did);
    if (!(await this.identityOwner(did) === this.identity.address)) {
      throw new OnlyOwnerAllowed(identity, await this.getOwnerAddress());
    }
    const attributeName = this._composeAttributeName(didAttribute, updateData);
    const bytesOfAttribute = formatBytes32String(attributeName);
    const bytesOfValue = hexify(
      didAttribute === PublicKey || didAttribute === ServicePoint
        ? (updateData as IUpdateAttributeData).value
        : (updateData as IUpdateDelegateData).delegate
    );
    const params = [identity, bytesOfAttribute, bytesOfValue];
    if (validity && validity > 0) {
      params.push(validity.toString());
    }
    const data = new Interface(erc1056Abi).encodeFunctionData(method, params);
    let receipt;
    try {
      const tx = await this.identity.sendTransaction(
        this._contract.address,
        data,
        0
      );
      receipt = await tx.wait();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return BigNumber.from(receipt.blockNumber);
  }
}
