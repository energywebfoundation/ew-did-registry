import { ICredentialStatus, ICredentialSubject, IProof } from '@sphereon/pex';
import { ICredential } from '@sphereon/pex/dist/main/lib/types';
import { ICredentialContextType } from '@sphereon/pex/dist/main/lib/types/SSI.types';
import { EIP712Proof } from './eip712proof.types';

export type CredentialSubject = ICredentialSubject;

export interface Credential<T extends CredentialSubject> extends ICredential {
  '@context': ICredentialContextType[];
  credentialSubject: T;
  credentialStatus?: StatusList2021Entry;
}

export interface StatusList2021Entry extends ICredentialStatus {
  type: CredentialStatusType;
  statusPurpose: CredentialStatusPurpose;
  statusListIndex: string;
  statusListCredential: string;
}

export enum CredentialStatusType {
  StatusList2021 = 'StatusList2021',
}

export enum CredentialStatusPurpose {
  REVOCATION = 'revocation',
  SUSPENSION = 'suspension',
}

export interface VerifiableCredential<T extends CredentialSubject>
  extends Credential<T> {
  proof: EIP712Proof | IProof;
}
