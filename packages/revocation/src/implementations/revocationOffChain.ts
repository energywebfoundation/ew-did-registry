import {
  Event, utils, Signer,
} from 'ethers';
import { EwSigner } from '@ew-did-registry/did-ethr-resolver';
import { RevocationRegistry, RevocationRegistry__factory } from '../../ethers';

export class RevocationOffChain {
  private _revocationRegistryOffChain: RevocationRegistry;

  /**
  * @param revoker - Entity which perform revocation
  * @param addressOffChain - Address of the off chain claim's RevocationRegistry
  */
  constructor(
    revoker: EwSigner,
    addressOffChain: string,
  ) {
    this._revocationRegistryOffChain = RevocationRegistry__factory.connect(
      addressOffChain,
      revoker as Signer,
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
    const credentialHash = utils.keccak256(utils.toUtf8Bytes(credential));
    try {
      const tx = await this._revocationRegistryOffChain.revokeClaim(credentialHash);
      const receipt = await tx.wait();
      const event = receipt.events?.find(
        (e: Event) => (e.event === 'Revoked'),
      );
      if (!event) return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
    return true;
  }

  /**
  * Checks the revocation details for a credential
  * Returns the revokers and revocationTimeStamp for the revocations
  *
  * @param { string } credential - credential for which the status is to be checked
  * @returns Promise<Array<string[]>>
  */
  async getRevocations(credential: string): Promise<Array<string[]>> {
    const credentialHash = utils.keccak256(utils.toUtf8Bytes(credential));
    const result = await this._revocationRegistryOffChain.getRevocations(
      credentialHash,
    );
    const { 0: revokers, 1: timeStamps } = result;
    const revokedTimeStamp = [];
    for (let i = 0; i <= timeStamps.length; i++) {
      revokedTimeStamp[i] = (Number(timeStamps[i]?._hex), 10).toString();
    }
    return ([revokers, revokedTimeStamp]);
  }
}
