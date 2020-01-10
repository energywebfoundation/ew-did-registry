import { expect } from 'chai';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { ProofClaim } from '../src/proof';

describe('[PROOF CLAIM]', () => {
  const { bn, codec } = sjcl;
  const curve = sjcl.ecc.curves.k256;
  const paranoia = 6;
  const order = curve.r;
  /**
  * represents hashed values of some secret data
  */
  const hashedField = bn.random(order, paranoia).toString();
  const PK = curve.G.mult(new bn(hashedField));
  const fieldName = 'secret';
  /**
   * private data owner's keys
   */
  const verifyData = {
    [fieldName]: codec.hex.fromBits(PK.toBits()),
  };

  it('proof claim created by the owner of the private data should pass verification', async () => {
    const ownerKeys = new Keys();
    const ownerJwt = new JWT(ownerKeys);
    const verifyToken = await ownerJwt.sign(verifyData, { algorithm: 'ES256', noTimestamp: true });
    let proofClaim = new ProofClaim({
      hashedFields: { [fieldName]: hashedField },
      keyPair: ownerKeys,
      jwt: ownerJwt,
      claimData: {
        did: `did:ewc:${ownerKeys.publicKey}`,
      },
    });
    await proofClaim.tokenCreated;
    const verifierKeys = new Keys();
    const proofToken = proofClaim.token;
    proofClaim = new ProofClaim({
      token: proofToken,
      keyPair: verifierKeys,
      jwt: new JWT(verifierKeys),
      claimData: {
        did: `did:ewc:${verifierKeys.publicKey}`,
      },
    });
    expect(proofClaim.verify(verifyToken)).true;
  });
});
