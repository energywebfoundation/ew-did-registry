import { isPlainObject, has } from 'lodash';
import { Credential, VerifiableCredential } from './credentials.types';
import { Presentation } from './presentation.types';

function isObject(obj: unknown): obj is object {
  return isPlainObject(obj);
}

function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  key: Y
): obj is X & Record<Y, unknown> {
  return has(obj, key);
}

function hasRequiredProperties(
  obj: object,
  requiredProperties: string[]
): boolean {
  return requiredProperties.map((key) => has(obj, key)).every(Boolean);
}

function hasValidProof(proof: unknown): boolean {
  const requiredProofProperties = [
    'verificationMethod',
    'proofPurpose',
    'created',
    'type',
  ];

  if (!isObject(proof)) return false;
  if (!hasRequiredProperties(proof, requiredProofProperties)) return false;
  if (!hasOwnProperty(proof, 'jws') && !hasOwnProperty(proof, 'proofValue')) {
    return false;
  }

  return true;
}

export function isCredential(
  credential: unknown
): credential is Credential<Record<string, unknown>> {
  const requiredProperties = [
    'credentialSubject',
    '@context',
    'id',
    'issuanceDate',
    'issuer',
    'type',
  ];
  if (!isObject(credential)) return false;
  if (!hasRequiredProperties(credential, requiredProperties)) return false;

  return true;
}

export function isVerifiableCredential(
  credential: unknown
): credential is VerifiableCredential<Record<string, unknown>> {
  if (!isCredential(credential)) return false;
  if (!hasOwnProperty(credential, 'proof')) return false;
  if (!hasValidProof(credential.proof)) return false;

  return true;
}

export function isPresentation(
  presentation: unknown
): presentation is Presentation {
  const requiredProperties = [
    'verifiableCredential',
    '@context',
    'id',
    'type',
    'holder',
  ];
  if (!isObject(presentation)) return false;

  if (!hasRequiredProperties(presentation, requiredProperties)) return false;
  if (!hasOwnProperty(presentation, 'verifiableCredential')) return false;
  if (!Array.isArray(presentation.verifiableCredential)) return false;
  if (
    !presentation.verifiableCredential.every((vc) => isVerifiableCredential(vc))
  ) {
    return false;
  }

  return true;
}

export function isVerifiablePresentation(
  presentation: unknown
): presentation is VerifiableCredential<Record<string, unknown>> {
  if (!isPresentation(presentation)) return false;
  if (!hasOwnProperty(presentation, 'proof')) return false;
  if (!hasValidProof(presentation.proof)) return false;

  return true;
}
