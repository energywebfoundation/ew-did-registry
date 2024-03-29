import {
  StatusList2021Entry,
  StatusList2021Credential,
  validateStatusListEntry,
  validateStatusList,
} from '@ew-did-registry/credentials-interface';
import { ungzip } from 'pako';
import axios from 'axios';
import {
  CredentialRevoked,
  InsecureStatusList,
  InvalidStatusList,
} from '../errors';

/**
 * Verifies status of verifiable credential
 *
 * Sample usage for a Verifiable Credential with StatusList2021:
 *
 * ```typescript
 * const statusListEntry = verifiableCredential.statusListEntry;
 * const statusListEntryVerifier = new StatusListEntryVerification(verifyProof);
 * await statusListEntryVerifier.verifyStatusListEntry(statusListEntry);
 * ```
 */
export class StatusListEntryVerification {
  /**
   * @param verifyProof function to verify proof of status list credential
   */
  constructor(
    private verifyProof: (vc: string, proofOptions: string) => Promise<unknown>
  ) {}

  /**
   * Verifies that credential status exists, valid and has not been revoked
   *
   * @param credentialStatus link to credential status
   * @param proofOptions options to verify status list
   */
  async verifyCredentialStatus(
    credentialStatus: StatusList2021Entry,
    proofOptions = JSON.stringify({})
  ) {
    validateStatusListEntry(credentialStatus);

    const statusListCredential = await this.fetchStatusListCredential(
      credentialStatus.statusListCredential
    );
    if (!statusListCredential) {
      return;
    }
    validateStatusList(statusListCredential);

    const verifyResults = JSON.parse(
      (await this.verifyProof(
        JSON.stringify(statusListCredential),
        proofOptions
      )) as string
    );

    if (verifyResults.errors.length) {
      throw new InvalidStatusList(verifyResults.errors);
    }

    if (this.isStatusSet(statusListCredential, credentialStatus)) {
      throw new CredentialRevoked();
    }
  }

  /**
   * Verifies that credential status is revoked
   * @param statusList list of credential statuses
   * @param status credential status
   * @returns true if the status is revoked
   */
  private isStatusSet(
    statusList: StatusList2021Credential,
    status: StatusList2021Entry
  ) {
    const decodedList = ungzip(
      Buffer.from(statusList.credentialSubject.encodedList, 'base64')
    );
    return decodedList[parseInt(status.statusListIndex)] === 1;
  }

  /**
   * Fetches status list credential
   * @param url URL of the status list
   * @return  StatusListCredential
   */
  async fetchStatusListCredential(
    url: string
  ): Promise<StatusList2021Credential | null> {
    this.verifyStatusListUrl(url);
    const { data, status } = await axios.get<StatusList2021Credential | null>(
      url
    );
    return status === 200 ? data : null;
  }

  /**
   * Validates the URL
   * @param url to be validated
   */
  private verifyStatusListUrl(url: string) {
    if (!url.startsWith('https:')) {
      throw new InsecureStatusList(url);
    }
  }
}
