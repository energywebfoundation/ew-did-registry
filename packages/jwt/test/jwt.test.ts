import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Wallet } from 'ethers';
import jsonwebtoken from 'jsonwebtoken';
import ECKey from 'ec-key';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '../src/JWT256K';
import { Algorithms, JwtPayload } from '../src/types';

const { expect, should } = chai;

chai.use(chaiAsPromised);
should();

let payload: JwtPayload;
const defaultPayload = { claim: 'test' };

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
      payload = defaultPayload;
      algorithm = Algorithms.ES256;
      verifier = new JWT(new Keys());
      const privKey = ECKey.createECKey('prime256v1');
      signerPubKey = privKey.publicCodePoint.toString('hex');
      token = jsonwebtoken.sign(payload, privKey.toString('pem'), { algorithm: 'ES256', noTimestamp: true });
    });
    testSuite();
  });

  describe('[ES256] - iot safe', () => {
    before(() => {
      payload =  {
        "claimData": {
          "blockNumber": 999999999999
        },
        "iss": "did:ethr:0x0F11d47D4dc4be53919a5976cC91b595eb9714aE"
      }
      algorithm = Algorithms.ES256;
      verifier = new JWT(new Keys());
      signerPubKey = '0x047B833B066AA8ECCCC3023B464432230C69776B911E82A7EF65A7635BF68EA692DD30668677240C6A5A558DC9EAC4F9A484973F62C51A37A39C9D0E90F8FDB858';
      token = 'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogIkpXVCJ9.eyJjbGFpbURhdGEiOiB7ImJsb2NrTnVtYmVyIjogOTk5OTk5OTk5OTk5fSwgImlzcyI6ICJkaWQ6ZXRocjoweDBGMTFkNDdENGRjNGJlNTM5MTlhNTk3NmNDOTFiNTk1ZWI5NzE0YUUifQ.YidYXHhkZE1ceDhlXHhkOCxceGE3aTpceDljXHhjNlxuXHhmZFx4ZjVceGNlXHhkOCBceDg5SFx4Yzg8XFw0Nm9ceGQ1Zlx4YjJceDgzXHgwM1x4ZGNceDg2XHhjYlx4Y2VceDBlU3VceDEyXHg5Nlx4ZjZ2XHhkM1xuXHhlYlx4Y2ZceGU5XHg5Ym1ceGNjSDRceGE1XHhjZExgXHhkN3lbXHhmNTxcdHFkLic';
    });
    testSuite();
  });

  describe('[EIP191]', () => {
    describe('[Keys]', () => {
      before(async () => {
        payload = defaultPayload;
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
        payload = defaultPayload;
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
