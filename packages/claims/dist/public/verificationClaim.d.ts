import Claim from './claim';
import { IVerificationClaim } from '../models';
declare class VerificationClaim extends Claim implements IVerificationClaim {
    verify(): boolean;
    approve(): Promise<string>;
}
export default VerificationClaim;
