import { IVerificationClaim } from '../models';
import Claim from './claim';
export default class VerificationClaim extends Claim implements IVerificationClaim {
    approve(): string;
    verify(): boolean;
}
