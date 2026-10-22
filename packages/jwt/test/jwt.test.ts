import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Wallet } from 'ethers';
import jsonwebtoken from 'jsonwebtoken';
import ECKey from 'ec-key';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '../src/JWTEIP191';
import { Algorithms } from '../src/types';
import { JwtVerificationFailed } from '../src/JwtVerificationFailed';

const { expect, should } = chai;

chai.use(chaiAsPromised);
should();

const payload = { claim: 'test' };

describe('[JWT PACKAGE]', () => {
  let signerPubKey: string;
  let signer: JWT;
  let token: string;
  let verifier: JWT;
  let algorithm: Algorithms;

  const testSuite = () => {
    it('jwt signed with private key should return a string', async () => {
      expect(token).to.be.a('string');
    });

    it('signed token should be verified', async () => {
      expect(
        verifier.verify(token, signerPubKey, { algorithms: [algorithm] })
      ).to.eql(payload);
    });

    it('verification with wrong signature should throw error', async () => {
      expect(() =>
        verifier.verify(token, new Keys().publicKey, {
          algorithms: [algorithm],
        })
      ).to.throw();
    });

    it('decoding without signature check return the payload', async () => {
      expect(verifier.decode(token)).to.eql(payload);
    });
  };

  describe('[ES256]', () => {
    before(() => {
      algorithm = Algorithms.ES256;
      verifier = new JWT(new Keys());
      const privKey = ECKey.createECKey('prime256v1');
      signerPubKey = privKey.publicCodePoint.toString('hex');
      token = jsonwebtoken.sign(payload, privKey.toString('pem'), {
        algorithm: 'ES256',
        noTimestamp: true,
      });
    });
    testSuite();

    it('should throw an error when token is expired', async () => {
      const privKey = ECKey.createECKey('prime256v1');
      const expiredToken = await new JWT(new Keys()).sign(
        { foo: 'bar' },
        { expirationTimestamp: Date.now() + 1 }
      );
      await new Promise((resolve) => setTimeout(resolve, 2));

      expect(() =>
        new JWT(new Keys()).verify(
          expiredToken,
          privKey.publicCodePoint.toString('hex')
        )
      ).to.throw(JwtVerificationFailed);
    });
  });

  describe('[EIP191]', () => {
    describe('[Keys]', () => {
      before(async () => {
        algorithm = Algorithms.EIP191;
        const signerKeys = new Keys();
        signerPubKey = signerKeys.publicKey;
        signer = new JWT(signerKeys);
        verifier = new JWT(new Keys());
        token = await signer.sign(payload, { noTimestamp: true });
      });

      testSuite();
    });

    describe('[ethers.Signer]', () => {
      before(async () => {
        algorithm = Algorithms.EIP191;
        const signerWallet = Wallet.createRandom();
        signerPubKey = signerWallet.publicKey;
        signer = new JWT(signerWallet);
        verifier = new JWT(Wallet.createRandom());
        token = await signer.sign(payload, { noTimestamp: true });
      });

      testSuite();
    });
  });
});

describe('[JWT iat/exp timestamps]', () => {
  const signer = new JWT(new Keys());
  // `sign` mutates its payload argument, so each test uses a fresh object
  const freshPayload = () => ({ claim: 'test' });

  it('`iat` should be a NumericDate in seconds, not milliseconds (RFC 7519)', async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const token = await signer.sign(freshPayload());
    const { iat } = signer.decode(token) as { iat: number };

    expect(iat).to.be.a('number');
    expect(Number.isInteger(iat)).to.equal(true);
    // within a 5s window of "now" expressed in seconds; a milliseconds value
    // would be ~1000x larger and fail this by many orders of magnitude
    expect(Math.abs(iat - nowSeconds)).to.be.lessThan(5);
  });

  it('`iat` and `exp` should use the same unit', async () => {
    const token = await signer.sign(freshPayload(), {
      expirationTimestamp: Date.now() + 60_000,
    });
    const { iat, exp } = signer.decode(token) as { iat: number; exp: number };

    expect(exp - iat).to.be.greaterThan(0);
    // exp is ~60s after iat; if iat were in ms the gap would be hugely negative
    expect(exp - iat).to.be.lessThan(120);
  });

  it('`iat` is omitted when noTimestamp is set', async () => {
    const token = await signer.sign(freshPayload(), { noTimestamp: true });
    const decoded = signer.decode(token) as { iat?: number };

    expect(decoded.iat).to.equal(undefined);
  });
});
