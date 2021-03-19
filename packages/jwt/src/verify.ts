import base64url from 'base64url';
import jsonwebtoken from 'jsonwebtoken';
import KeyEncoder from 'key-encoder';
import { utils } from 'ethers';

const { computePublicKey } = utils;

const {
  keccak256,
  hashMessage,
  arrayify,
  recoverPublicKey,
} = utils;

const keyEncoder = new KeyEncoder('secp256k1');

const verifyJwtSignature = () => async (
  token: string,
  publicKey: string,
  options?: Record<string, unknown>,
):
  Promise<{ success: boolean; payload?: unknown }> => new Promise(
  (resolve) => {
    const pemPublicKey = keyEncoder.encodePublic(publicKey, 'raw', 'pem');
    jsonwebtoken.verify(token, pemPublicKey, options, (error, payload) => {
      if (error) resolve({ success: false, payload: error });

      resolve({ success: true, payload });
    });
  },
);

const possibleKeys = (message: string, signature: string): string[] => [
  arrayify(keccak256(message)),
  arrayify(hashMessage(arrayify(keccak256(message)))),
]
  .map((h) => recoverPublicKey(h, signature))
  .map((key) => computePublicKey(key, true).slice(2));

const verifyEthersSignature = () => async (token: string, publicKey: string):
  Promise<{ success: boolean; payload?: unknown }> => {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  const msg = `0x${Buffer.from(`${encodedHeader}.${encodedPayload}`).toString('hex')}`;
  const signature = base64url.decode(encodedSignature);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of possibleKeys(msg, signature)) {
    if (key === publicKey) {
      return { success: true, payload: JSON.parse(base64url.decode(encodedPayload)) };
    }
  }
  return { success: false, payload: {} };
};

export const verificationMethods = [verifyJwtSignature(), verifyEthersSignature()];
