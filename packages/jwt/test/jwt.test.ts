import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Wallet } from 'ethers';
import jsonwebtoken from 'jsonwebtoken';
import ECKey from 'ec-key';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '../src/JWT256K';
import { Algorithms } from '../src/types';

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
      expect(verifier.verify(token, signerPubKey, { algorithms: [algorithm] })).to.eql(payload);
    });

    it('verification with wrong signature should throw error', async () => {
      expect(
        () => verifier.verify(token, new Keys().publicKey, { algorithms: [algorithm] }),
      )
        .to
        .throw();
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
      token = jsonwebtoken.sign(payload, privKey.toString('pem'), { algorithm: 'ES256', noTimestamp: true });
    });
    testSuite();
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
