import { Algorithms } from './types';

export class JwtAlgorithmNotSupported extends Error {
  constructor(alg: Algorithms) {
    super(`${alg} is not supported`);
  }
}
