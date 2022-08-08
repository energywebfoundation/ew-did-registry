export enum Algorithms {
  'ES256',
  'EIP191',
}

export type JwtSignOptions = {
  issuer?: string;
  subject?: string;
  noTimestamp?: boolean;
  algorithm?: Algorithms;
  expirationTimestamp?: number; // Number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
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
