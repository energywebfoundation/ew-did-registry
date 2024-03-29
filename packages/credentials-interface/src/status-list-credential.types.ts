import {
  CredentialStatusPurpose,
  CredentialStatusType,
  CredentialType,
  StatusList2021Entry,
  StatusListEntryType,
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
  statusListEntry: StatusList2021Entry
) => {
  if (statusListEntry.type !== StatusListEntryType.Entry2021) {
    throw new Error('Not a StatusList2021 entry');
  }
  if (
    ![
      CredentialStatusPurpose.REVOCATION,
      CredentialStatusPurpose.SUSPENSION,
    ].includes(statusListEntry.statusPurpose)
  ) {
    throw new Error('StatusList2021Entry does not have revocation purpose');
  }
};

export const validateStatusList = (statusList: StatusList2021Credential) => {
  if (
    !statusList.type.includes(
      CredentialType.StatusList2021Credential ||
        statusList.credentialSubject.type !==
          CredentialStatusType.StatusList2021
    )
  ) {
    throw new Error('Not status list credential');
  }

  if (!statusList['@context'].includes(StatusList2021Context)) {
    throw new Error('StatusList2021 context not found');
  }

  // @todo credential validator
  if (!statusList?.issuer) {
    throw new Error('No issuer found for the credential');
  }

  if (
    ![
      CredentialStatusPurpose.REVOCATION,
      CredentialStatusPurpose.SUSPENSION,
    ].includes(statusList.credentialSubject.statusPurpose)
  ) {
    throw new Error('StatusList2021 does not have revocation purpose');
  }
};
