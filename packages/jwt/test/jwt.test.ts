import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Wallet } from 'ethers';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '../src';

const { expect, should } = chai;
chai.use(chaiAsPromised);

should();

const keyPairAlice = new Keys({ privateKey: '635a1ba32ab7218f6df7785c8e128f485c612cdb68cf12a1157987130e7e6d0d' });

const jwtAlice = new JWT(keyPairAlice);
const payload = { claim: 'test' };

let token: string;
let jwt: JWT;

const testSuite = (): void => {
  it('jwt signed with private key should return a string', async () => {
    expect(token).to.be.a('string');
  });

  it('verified jwt should return the payload', async () => {
    const BobKeyPair = new Keys({ privateKey: '63511ba32ab7218f6df7785c8e128f485c612cdb68cf12a1157987130e7e6d0d' });
    const jwtBob = new JWT(BobKeyPair);

    let decoded;

    try {
      decoded = await jwtBob.verify(token, keyPairAlice.publicKey);
    } catch (e) {
      console.log(e);
    }
    expect(decoded).to.eql(payload);
  });

  it('verification with wrong signature should throw error', async () => {
    const BobKeyPair = new Keys({ privateKey: '63511ba32ab7218f6df7785c8e128f485c612cdb68cf12a1157987130e7e6d0d' });
    const jwtBob = new JWT(BobKeyPair);

    try {
      await jwtBob.verify(token, BobKeyPair.publicKey);
    } catch (e) {
      expect(e.message).is.equal('invalid signature');
    }
  });

  it('decoding without signature check return the payload', () => {
    const BobKeyPair = new Keys({ privateKey: '63511ba32ab7218f6df7785c8e128f485c612cdb68cf12a1157987130e7e6d0d' });
    const jwtBob = new JWT(BobKeyPair);

    const decoded = jwtBob.decode(token);

    expect(decoded).to.eql(payload);
  });
};

describe('[JWT PACKAGE: sign with Keys]', () => {
  before(async () => {
    try {
      token = await jwtAlice.sign({ claim: 'test' }, { algorithm: 'ES256', noTimestamp: true });
    } catch (e) {
      console.log(e);
    }
  });

  testSuite();
});

describe('[JWT PACKAGE: sign with Signer]', () => {
  before(async () => {
    const signer = new Wallet(keyPairAlice.privateKey);
    jwt = new JWT(signer);
    token = await jwt.sign(payload);
  });

  testSuite();
});
