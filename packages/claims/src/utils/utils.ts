import crypto from 'crypto';

export const hashes: { [hashAlg: string]: (data: string) => string } = {
  SHA256: (data: string): string => crypto.createHash('sha256').update(data).digest('hex'),
};
