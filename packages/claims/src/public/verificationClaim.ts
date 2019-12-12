/* eslint-disable class-methods-use-this */

import { IVerificationClaim } from '../models';
import Claim from './claim';

export default class VerificationClaim extends Claim implements IVerificationClaim {
  approve(): string {
    return '';
  }

  verify(): boolean {
    return false;
  }
}
