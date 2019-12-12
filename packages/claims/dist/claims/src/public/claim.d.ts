import { IJWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IClaim, IClaimBuildData, IClaimData } from '../models';
export default class Claim implements IClaim {
    claimData: IClaimData;
    jwt: IJWT;
    keyPair: IKeys;
    token: string;
    constructor(data: IClaimBuildData);
    getDid(): string;
}
