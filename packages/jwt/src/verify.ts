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

const verifyJwtSignature = () => {
  const verify = async (token: string, publicKey: string, options?: object):
    Promise<object> => new Promise(
    (resolve) => {
      const pemPublicKey = keyEncoder.encodePublic(publicKey, 'raw', 'pem');
      jsonwebtoken.verify(token, pemPublicKey, options, (error: Error, payload: object) => {
        if (error) resolve({ success: false, payload: error });

        resolve({ success: true, payload });
      });
    },
  );
  return verify;
};

const possibleKeys = (message: string, signature: string) => [
  arrayify(keccak256(message)),
  arrayify(hashMessage(arrayify(keccak256(message)))),
]
  .map((h) => recoverPublicKey(h, signature))
  .map((key) => computePublicKey(key, true).slice(2));

const verifyEthersSignature = () => {
  const verify = async (token: string, publicKey: string) => {
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
  return verify;
};

export const verificationMethods = [verifyJwtSignature(), verifyEthersSignature()];
