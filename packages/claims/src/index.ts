import { IKeys } from '@ew-did-registry/keys';
import { IDIDDocument } from '@ew-did-registry/did-resolver';
import { JWT } from '@ew-did-registry/jwt';
import { IClaims } from './interface';
import { Claim, VerificationClaim } from './public';
import { PrivateClaim } from './private';

export {
  IClaims,
  Claim,
  VerificationClaim,
  PrivateClaim,
};
export * from './models';
export * from './proof';
