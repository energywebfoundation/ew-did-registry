import {
  Contract, ethers, Event, utils,
} from 'ethers';
import { EwSigner, addressOf } from '@ew-did-registry/did-ethr-resolver';
import { abi as RevocationOnChainAbi } from '../constants/RevocationRegistryOnChain.json';

export class RevocationOnChain {
  private _revocationRegistryOnChain: Contract;

  /**
  * @param owner - Entity which controls revocation
  * @param addressOnchain - Address of the on chain claim's RevocationRegistry
  */
  constructor(
    owner: EwSigner,
    addressOnChain: string,
  ) {
    this._revocationRegistryOnChain = new ethers.Contract(
      addressOnChain,
      RevocationOnChainAbi,
      owner,
    );
  }

  /**
  * Revokes the on chain role
  * Returns true on success
  *
  * @param { string } role - role to be revoked
  * @param { string } subject - DID of which the role is being revoked
  * @param { string } revoker - DID of the revoker
  * @returns Promise<boolean>
  */
  async revokeRole(role: string, subject: string, revoker: string):
  Promise<boolean> {
    const roleHash = utils.namehash(role);
    const subjectAddress = addressOf(subject);
    const revokerAddress = addressOf(revoker);
    try {
      const tx = await this._revocationRegistryOnChain.revokeClaim(
        roleHash,
        subjectAddress,
        revokerAddress,
      );
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
  * Revokes the roles for list of DIDs
  * Returns true on success
  *
  * @param { string } role - role to be revoked for the DIDs
  * @param { string[] } subjects - DIDs for which the roles are being revoked
  * @param { string } revoker - DID of the revoker
  * @returns Promise<boolean>
  */
  async revokeListOfRoles(role: string, subjects: string [], revoker: string):
  Promise<boolean> {
    const roleHash = utils.namehash(role);
    const revokerAddress = addressOf(revoker);
    const revocationSubjects = [];
    for (let _i = 0; _i < subjects.length; _i++) {
      revocationSubjects[_i] = addressOf(subjects[_i]);
    }
    try {
      const tx = await this._revocationRegistryOnChain.revokeClaimsInList(
        roleHash,
        revocationSubjects,
        revokerAddress,
      );
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
  * checks the revocation status of a role
  * Returns the status of the role
  *
  * @param { string } role - role for which the status is to be checked
  * @param { string } subject - DID for which the status is to be checked
  * @returns Promise<boolean>
  */
  async isRoleRevoked(role: string, subject: string): Promise<boolean> {
    const subjectAddress = addressOf(subject);
    const revokedStatus = await this._revocationRegistryOnChain.isRevoked(
      utils.namehash(role),
      subjectAddress,
    );
    return revokedStatus;
  }

  /**
  * checks the revocation details for a subject's role
  * Returns the revoker and revocationTimeStamp for the revocation
  *
  * @param { string } role - role for which the status is to be checked
  * @param { string } subject - DID for which the status is to be checked
  * @returns Promise<string[]>
  */
  async getRevocationDetail(
    role: string,
    subject: string,
  ): Promise<string[]> {
    const subjectAddress = addressOf(subject);
    const result = await this._revocationRegistryOnChain.getRevocationDetail(
      utils.namehash(role),
      subjectAddress,
    );
    const { 0: revoker, 1: revokedTimeStamp } = result;
    return ([revoker, revokedTimeStamp]);
  }
}
