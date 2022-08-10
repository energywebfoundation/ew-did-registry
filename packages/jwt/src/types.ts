export enum Algorithms {
  'ES256',
  'EIP191',
}

export type JwtSignOptions = {
  issuer?: string;
  subject?: string;
  noTimestamp?: boolean;
  algorithm?: Algorithms;
  /**
   * In milliseconds
   */
  expirationTimestamp?: number;
};

export type JwtVerifyOptions = {
  algorithms?: Algorithms[];
};

export type JwtPayload = {
  iss?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};
