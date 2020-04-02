import { ec as EC } from 'elliptic';
import { DidPrivateKey } from './crypto';

const ec = new EC('secp256k1');

export const createJwkFromHex = (privateKey: string, keyId: string): DidPrivateKey => {
  const pubKey = ec.keyFromPrivate(privateKey).getPublic();
  return new DidPrivateKey({
    type: 'EcdsaSecp256k1VerificationKey2019', // 'EC'
    controller: '', // unknown before registration
    id: keyId,
    publicKeyJwk: {
      kid: keyId,
      d: Buffer.from(privateKey, 'hex').toString('base64'),
      crv: 'P-256K',
      x: pubKey.getX().toBuffer().toString('base64'),
      y: pubKey.getY().toBuffer().toString('base64'),
    },
  });
}