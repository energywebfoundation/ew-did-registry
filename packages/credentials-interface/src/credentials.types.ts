import {
  ICredentialStatus,
  ICredentialSubject,
  IVerifiableCredential,
  IProof,
} from '@sphereon/pex';
import { EIP712Proof } from './eip712proof.types';

export type CredentialSubject = ICredentialSubject;

export interface Credential<T extends CredentialSubject>
  extends IVerifiableCredential {
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
