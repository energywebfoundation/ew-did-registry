import {
  Contract, ethers, Event, utils,
} from 'ethers';
import { EwSigner, addressOf } from '@ew-did-registry/did-ethr-resolver';
import { abi as RevocationOnChainAbi } from '../constants/RevocationRegistryOnChain.json';
import { abi as RevocationOffChainAbi } from '../constants/RevocationRegistryOffChain.json';

export class Revocation {
  private _revocationRegistryOnChain: Contract;

  private _revocationRegistryOffChain: Contract;

  /**
  * @param owner - Entity which controls revocation
  */
  constructor(
    owner: EwSigner,
    addressOnchain: string,
    addressOffChain: string,
  ) {
    this._revocationRegistryOnChain = new ethers.Contract(
      addressOnchain,
      RevocationOnChainAbi,
      owner,
    );
    this._revocationRegistryOffChain = new ethers.Contract(
      addressOffChain,
      RevocationOffChainAbi,
      owner,
    );
  }

  /**
  * Revokes the on chain role
  * Returns true on success
  *
  * @param { string } role - on chain role to be revoked
  * @param { string } subject - DID of which the role is being revoked
  * @param { string } revokerRole - did of the revoker
  * @returns Promise<boolean>
  */
  async revokeOnChainRole(role: string, subject: string, revoker: string):
  Promise<boolean> {
    const roleHash = utils.namehash(role);
    const subjectAddress = addressOf(subject);
    const revokerAddress = addressOf(revoker);
    try {
      const tx = await this._revocationRegistryOnChain.revokeClaim(
        roleHash,
        subjectAddress,
        revokerAddress
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
  * Revokes the off chain role
  * Returns true on success
  *
  * @param { string } role - off chain role to be revoked
  * @param { string } subject - DID of which the role is being revoked
  * @returns Promise<boolean>
  */
  async revokeOffChainRole(role: string, subject: string): Promise<boolean> {
    const subjectAddress = addressOf(subject);
    try {
      const tx = await this._revocationRegistryOffChain.revokeClaim(
        utils.namehash(role),
        subjectAddress,
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: Event) => (e.event === 'Revoked'),
      );
      if (!event) return false;
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
    return true;
  }

  /**
  * Revokes the roles for list of DIDs
  * Returns true on success
  *
  * @param { string[] } dids - dids for which the roles are being revoked
  * @param { string } role - role to be revoked for the DIDs
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
      const tx = await this._revocationRegistryOnChain.revokerClaimsInList(
        roleHash,
        revocationSubjects,
        revokerAddress
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
  * @param { boolean } isOnChainRole - bool value to tell if a role is on chain
  * @returns Promise<boolean>
  */
  async isRoleRevoked(role: string, subject: string, isOnChainRole: boolean): Promise<boolean> {
    const subjectAddress = addressOf(subject);
    let revokedStatus;
    if (isOnChainRole) {
      revokedStatus = await this._revocationRegistryOnChain.isRevoked(
        utils.namehash(role),
        subjectAddress,
      );
    } else {
      revokedStatus = await this._revocationRegistryOffChain.isRevoked(
        utils.namehash(role),
        subjectAddress,
      );
    }
    return revokedStatus;
  }

  /**
  * checks the revocation details for a subject's role
  * Returns the revoker and revocationTimeStamp for the revocation
  *
  * @param { string } role - role for which the status is to be checked
  * @param { string } subject - DID for which the status is to be checked
  * @param { boolean } isOnChainRole - bool value to tell if a role is on chain
  * @returns Promise<string>
  */
  async getRevocationDetail(role: string, subject: string, isOnChainRole: boolean): Promise<string[]> {
    const subjectAddress = addressOf(subject);
    let result;
    if (isOnChainRole) {
      result = await this._revocationRegistryOnChain.getRevocationDetail(
        utils.namehash(role),
        subjectAddress,
      );
    } else {
      result = await this._revocationRegistryOffChain.getRevocationDetail(
        utils.namehash(role),
        subjectAddress,
      );
    }
    const {0: revoker, 1: revokedTimeStamp} = result;
    return ([revoker, revokedTimeStamp]);
  }
}
