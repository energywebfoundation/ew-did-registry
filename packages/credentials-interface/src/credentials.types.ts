import { ICredentialStatus, ICredentialSubject, IProof } from '@sphereon/pex';
import { ICredential } from '@sphereon/pex/dist/main/lib/types/SSI.types';
import { EIP712Proof } from './eip712proof.types';

export type CredentialSubject = ICredentialSubject;

export interface Credential<T extends CredentialSubject> extends ICredential {
  credentialSubject: T;
  credentialStatus?: StatusList2021Entry;
}

export enum CredentialStatusType {
  StatusList2021Entry = 'StatusList2021Entry',
}

export enum CredentialStatusPurpose {
  REVOCATION = 'revocation',
}

export interface StatusList2021Entry extends ICredentialStatus {
  type: CredentialStatusType;
  statusPurpose: CredentialStatusPurpose;
  statusListIndex: string;
  statusListCredential: string;
}

export interface VerifiableCredential<T extends CredentialSubject>
  extends Credential<T> {
  proof: EIP712Proof | IProof;
}
