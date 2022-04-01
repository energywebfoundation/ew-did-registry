import { ICredentialSubject, IPresentation, IProof } from '@sphereon/pex';
import { VerifiableCredential } from './credentials.types';
import { EIP712Proof } from './eip712proof.types';

export interface Presentation extends IPresentation {
  id: string;
  verifiableCredential: VerifiableCredential<ICredentialSubject>[];
}

export interface VerifiablePresentation extends Presentation {
  proof: EIP712Proof | IProof;
}
