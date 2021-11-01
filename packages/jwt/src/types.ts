export enum Algorithms { 'ES256', 'EIP191' }

export type JwtSignOptions = {
  issuer?: string; subject?: string; noTimestamp?: boolean; algorithm?: Algorithms;
};

export type JwtVerifyOptions = {
  algorithms?: Algorithms[];
}

export type JwtPayload = {
  iss?: string; sub?: string; iat?: number;[key: string]: unknown;
};
