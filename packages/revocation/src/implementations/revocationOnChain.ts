import { Event, utils, Signer } from 'ethers';
import { EwSigner, addressOf } from '@ew-did-registry/did-ethr-resolver';
import {
  RevocationRegistryOnChain,
  RevocationRegistryOnChain__factory,
} from '@energyweb/iam-contracts/dist/ethers';

export class RevocationOnChain {
  private _revocationRegistryOnChain: RevocationRegistryOnChain;

  /**
   * @param owner - Entity which controls revocation
   * @param addressOnchain - Address of the on chain claim's RevocationRegistry
   */
  constructor(owner: EwSigner, addressOnChain: string) {
    this._revocationRegistryOnChain =
      RevocationRegistryOnChain__factory.connect(
        addressOnChain,
        owner as Signer
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
  async revokeRole(
    role: string,
    subject: string,
    revoker: string
  ): Promise<boolean> {
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
      const event = receipt.events?.find((e: Event) => e.event === 'Revoked');
      if (!event) return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return true;
  }

  /**
   * Revokes the role for list of DIDs
   * Returns true on success
   *
   * @param { string } role - role to be revoked for the DIDs
   * @param { string[] } subjects - DIDs for which the role is being revoked
   * @param { string } revoker - DID of the revoker
   * @returns Promise<boolean>
   */
  async revokeRoleforDIDs(
    role: string,
    subjects: string[],
    revoker: string
  ): Promise<boolean> {
    const roleHash = utils.namehash(role);
    const revokerAddress = addressOf(revoker);
    const revocationSubjects = [];
    for (let i = 0; i < subjects.length; i++) {
      revocationSubjects[i] = addressOf(subjects[i]);
    }
    try {
      const tx = await this._revocationRegistryOnChain.revokeClaimsInList(
        roleHash,
        revocationSubjects,
        revokerAddress
      );
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: Event) => e.event === 'Revoked');
      if (!event) return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return true;
  }

  /**
   * Checks the revocation status of a role
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
      subjectAddress
    );
    return revokedStatus;
  }

  /**
   * Checks the revocation details for a subject's role
   * Returns the revoker and revocationTimeStamp for the revocation
   *
   * @param { string } role - role for which the status is to be checked
   * @param { string } subject - DID for which the status is to be checked
   * @returns Promise<string[]>
   */
  async getRevocationDetail(role: string, subject: string): Promise<string[]> {
    const subjectAddress = addressOf(subject);
    const result = await this._revocationRegistryOnChain.getRevocationDetail(
      utils.namehash(role),
      subjectAddress
    );
    const { 0: revoker, 1: revokedTimeStamp } = result;
    return [revoker, revokedTimeStamp.toString()];
  }
}
