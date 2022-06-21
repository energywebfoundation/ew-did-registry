import {
  StatusList2021Entry,
  StatusList2021Credential,
  validateStatusListEntry,
} from '@ew-did-registry/credentials-interface';
import { ungzip } from 'pako';
import axios from 'axios';
import {
  CredentialRevoked,
  InsecureStatusList,
  InvalidStatusList,
  NoStatusList,
} from '../errors';

/**
 * A Class to verify the StatusList2021Entry
 * Validates statusPurpose, statusListcredential & proof, revoked status from encodedList for the given statusListEntry
 *
 * Sample usage for a Verifiable Credential with StatusList2021:
 *
 * ```typescript
 * const statusListEntry = verifiableCredential.statusListEntry;
 * const statusListEntryVerifier = new StatusListEntryVerification(vcProofVerificationCallBack);
 * await statusListEntryVerifier.verifyStatusListEntry(statusListEntry);
 * ```
 */
export class StatusListEntryVerification {
  /**
   * @param verifyProof function to verify proof of credential
   */
  constructor(
    private verifyProof: (vc: string, proof_options: string) => Promise<any>
  ) {}

  /**
   * Verifies that credential status exists, valid and has not been revoked
   *
   * @param credentialStatus link to credential status
   * @param proofOptions options to verify status list
   */
  async verifyCredentialStatus(
    credentialStatus: StatusList2021Entry,
    proof_options = JSON.stringify({})
  ) {
    const statusListCredential = await this.fetchStatusListCredential(
      credentialStatus.statusListCredential
    );

    validateStatusListEntry(credentialStatus, statusListCredential);

    const verifyResults = JSON.parse(
      await this.verifyProof(
        JSON.stringify(statusListCredential),
        proof_options
      )
    );

    if (verifyResults.errors.length) {
      throw new InvalidStatusList(verifyResults.error);
    }

    if (this.isStatusRevoked(statusListCredential, credentialStatus)) {
      throw new CredentialRevoked();
    }
  }

  /**
   * Verifies that credential status is revoked
   * @param statusList list of credential statuses
   * @param status credential status
   * @returns true if the status is revoked
   */
  private isStatusRevoked(
    statusList: StatusList2021Credential,
    status: StatusList2021Entry
  ) {
    const decodedList = ungzip(
      Buffer.from(statusList.credentialSubject.encodedList, 'base64')
    );
    return decodedList[parseInt(status.statusListIndex)] === 1;
  }

  /**
   * Fetches the StatusListCredential
   * @param url URL of the status list
   * @return  StatusListCredential
   */
  private async fetchStatusListCredential(
    url: string
  ): Promise<StatusList2021Credential> {
    this.verifyStatusListUrl(url);
    const { data, status } = await axios.get<
      StatusList2021Credential | undefined
    >(url);
    if (status !== 200 || !data) {
      throw new NoStatusList(url);
    }
    return data;
  }

  /**
   * Validates the URL
   * @param url to be validated
   * @returns true if URL is valid
   */
  private verifyStatusListUrl(url: string) {
    if (!url.startsWith('https:')) {
      throw new InsecureStatusList(url);
    }
  }
}
