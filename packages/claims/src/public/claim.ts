/* eslint-disable class-methods-use-this */
import { IJWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IClaim, IClaimBuildData, IClaimData } from '../models';

export default class Claim implements IClaim {
    claimData: IClaimData;

    jwt: IJWT;

    keyPair: IKeys;

    token: string;

    constructor(data: IClaimBuildData) {
      this.jwt = data.jwt;
      this.keyPair = data.keyPair;
      this.claimData = data.claimData;
      this.claimData = data.claimData;
    }

    getDid(): string {
      return '';
    }
}
