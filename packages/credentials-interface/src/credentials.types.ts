import { ICredentialSubject, IJsonLdCredential, IProof } from '@sphereon/pex';
import { EIP712Proof } from './eip712proof.types';

export type CredentialSubject = ICredentialSubject;

export interface Credential<T extends CredentialSubject>
  extends IJsonLdCredential {
  credentialSubject: T;
}

export interface VerifiableCredential<T extends CredentialSubject>
  extends Credential<T> {
  proof: EIP712Proof | IProof;
}
