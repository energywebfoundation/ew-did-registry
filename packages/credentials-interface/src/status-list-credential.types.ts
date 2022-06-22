import {
  CredentialStatusPurpose,
  CredentialStatusType,
  StatusList2021Entry,
  VerifiableCredential,
} from './credentials.types';

export interface StatusList2021 {
  [key: string]: string;
  id: string;
  type: CredentialStatusType.StatusList2021;
  statusPurpose: CredentialStatusPurpose;
  encodedList: string;
}

export type StatusList2021Credential = VerifiableCredential<StatusList2021>;

export const StatusList2021Context = 'https://w3id.org/vc/status-list/2021/v1';

export const validateStatusListEntry = (
  statusListEntry: StatusList2021Entry,
  statusList: StatusList2021Credential
) => {
  if (statusListEntry.type !== CredentialStatusType.StatusList2021) {
    throw new Error('Not a StatusList2021 type');
  }
  if (
    ![
      CredentialStatusPurpose.REVOCATION,
      CredentialStatusPurpose.SUSPENSION,
    ].includes(statusListEntry.statusPurpose)
  ) {
    throw new Error('StatusList2021Entry does not have revocation purpose');
  }

  if (!statusList['@context'].includes(StatusList2021Context)) {
    throw new Error('StatusList2021 context not found');
  }

  if (!statusList?.issuer) {
    throw new Error('No issuer found for the credential');
  }
};
