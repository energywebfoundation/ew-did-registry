import { expect } from 'chai';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { ProofClaim } from '../src/proof';

const { bn } = sjcl;
describe('[PROOF CLAIM]', () => {
  const paranoia = 6;

  const curve = sjcl.ecc.curves.k256;
  const order = curve.r;

  const secret = bn.random(order, paranoia);
  const PK = curve.G.mult(secret);
  const name = 'field';

  const keys = new Keys();
  const jwt = new JWT(keys);

  const payload = {
    verifyData: {
      [name]: PK.toBits(),
    }
  };

  it('proof claim creted by the owner of the private data should pass verification', async () => {
    const verifyToken = await jwt.sign(payload);
    let hashedField = /*sjcl.hash.sha256.hash(*/secret.toBits()/*)*/;
    let proofClaim = new ProofClaim({
      hashedFields: [hashedField],
      keyPair: keys,
      jwt,
      claimData: {
        did: `did:ewc:${keys.publicKey}`,
      },
    });
    await proofClaim.tokenCreated;
    const proofToken = proofClaim.token;
    proofClaim = new ProofClaim({
      token: proofToken,
      keyPair: keys,
      jwt,
      claimData: {
        did: `did:ewc:${keys.publicKey}`,
      },
    });
    expect(proofClaim.verify(verifyToken)).true;
  });
});
