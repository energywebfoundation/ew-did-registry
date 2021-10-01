import {
  Contract, ethers, Event, utils,
} from 'ethers';
import { EwSigner } from '@ew-did-registry/did-ethr-resolver';
import { abi as RevocationOffChainAbi } from '../constants/RevocationRegistryOffChain.json';

export class RevocationOffChain {
  private _revocationRegistryOffChain: Contract;

  /**
  * @param revoker - Entity which perform revocation
  * @param addressOffChain - Address of the off chain claim's RevocationRegistry
  */
  constructor(
    revoker: EwSigner,
    addressOffChain: string,
  ) {
    this._revocationRegistryOffChain = new ethers.Contract(
      addressOffChain,
      RevocationOffChainAbi,
      revoker,
    );
  }

  /**
  * Revokes the credential
  * Returns true on success
  *
  * @param { string } credential - credential to be revoked
  * @returns Promise<boolean>
  */
  async revokeRole(credential: string): Promise<boolean> {
    try {
      const tx = await this._revocationRegistryOffChain.revokeClaim(utils.namehash(credential));
      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: Event) => (e.event === 'Revoked'),
      );
      if (!event) return false;
    } catch (error) {
      throw new Error(error);
    }
    return true;
  }

  /**
  * checks the revocation details for a credential
  * Returns the revokers and revocationTimeStamp for the revocations
  *
  * @param { string } credential - credential for which the status is to be checked
  * @returns Promise<string>
  */
  async getRevocationDetail(credential: string): Promise<string[]> {
    const result = await this._revocationRegistryOffChain.getRevocationDetail(
      utils.namehash(credential),
    );
    const { 0: revokers, 1: revokedTimeStamp } = result;
    return ([revokers, revokedTimeStamp]);
  }
}
