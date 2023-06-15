import { IPresentation, IProof } from '@sphereon/ssi-types';
import { CredentialSubject, VerifiableCredential } from './credentials.types';
import { EIP712Proof } from './eip712proof.types';

export interface Presentation extends IPresentation {
  id: string;
  verifiableCredential: VerifiableCredential<CredentialSubject>[];
}

export interface VerifiablePresentation extends Presentation {
  proof: EIP712Proof | IProof;
}
