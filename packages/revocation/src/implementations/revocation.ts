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
  * @param owner - Entity which controls document
  * @param settings - Settings to connect to Ethr registry
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
  * Revokes the on chain role from DID Document
  * Returns true on success
  *
  * @param { string } role - on chain role to be revoked
  * @param { string } subject - DID of which the role is being revoked
  * @param { string } revokerRole - did of the revoker
  * @returns Promise<boolean>
  */
  async revokeOnChainRole(role: string, subject: string, revoker: string, revokerRole: string):
  Promise<boolean> {
    const roleHash = utils.namehash(role);
    const subjectAddress = addressOf(subject);
    const revokerAddress = addressOf(revoker);
    try {
      const tx = await this._revocationRegistryOnChain.revokeClaim(
        utils.namehash(role + subjectAddress),
        roleHash,
        revokerAddress,
        utils.namehash(revokerRole + revokerAddress),
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
  * Revokes the off chain role from DID Document
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
        utils.namehash(role + subjectAddress),
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
  * @param { string[] } dids - dids for which the roles are being revoked
  * @param { string } role - role to be revoked for the DIDs
  * @param { string } revokerRole - Role of the revoker
  * @returns Promise<boolean>
  */
  async revokeListOfRoles(dids: string [], role: string, revoker: string, revokerRole: string):
  Promise<boolean> {
    const roleHash = utils.namehash(role);
    const revokerAddress = addressOf(revoker);
    const claimDigestList = [];
    for (let _i = 0; _i < dids.length; _i++) {
      claimDigestList[_i] = utils.namehash(role + addressOf(dids[_i]));
    }
    try {
      const tx = await this._revocationRegistryOnChain.revokerClaimsInList(
        claimDigestList,
        roleHash,
        revokerAddress,
        utils.namehash(revokerRole),
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
    const claimDigest = utils.namehash(role + subjectAddress);
    let revokedStatus;
    if (isOnChainRole) {
      revokedStatus = await this._revocationRegistryOnChain.isRevoked(claimDigest);
    } else {
      revokedStatus = await this._revocationRegistryOffChain.isRevoked(claimDigest);
    }
    return revokedStatus;
  }

  /**
  * checks the revoker of a role
  * Returns the revoker of the role
  *
  * @param { string } role - role for which the status is to be checked
  * @param { string } subject - DID for which the status is to be checked
  * @returns Promise<string>
  */
  async getRevoker(role: string, subject: string): Promise<string> {
    const subjectAddress = addressOf(subject);
    const claimDigest = utils.namehash(role + subjectAddress);
    const revoker = await this._revocationRegistryOffChain.getRevoker(claimDigest);
    return revoker;
  }
}
