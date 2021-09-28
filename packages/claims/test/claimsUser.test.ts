import { decrypt } from 'eciesjs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import {
  Operator, EwSigner,
} from '@ew-did-registry/did-ethr-resolver';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import {
  ClaimsUser, IClaimsUser, IPrivateClaim, IProofClaim,
} from '../src';
import { deployRegistry, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

const claimData = {
  name: 'John',
};

const providerSettings: ProviderSettings = {
  type: ProviderTypes.HTTP,
};

describe('[CLAIMS PACKAGE/USER CLAIMS]', function () {
  this.timeout(0);
  const userKeys = new Keys();
  const userAddress = userKeys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;
  const user = EwSigner.fromPrivateKey(userKeys.privateKey, providerSettings);

  const issuerKeys = new Keys();
  const issuerAddress = issuerKeys.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;
  const issuer = EwSigner.fromPrivateKey(issuerKeys.privateKey, providerSettings);

  let userClaims: IClaimsUser;
  let store: DidStore;
  let registry: string;

  before(async () => {
    registry = await deployRegistry([issuerAddress, userAddress]);
    console.log(`registry: ${registry}`);

    store = new DidStore(await spawnIpfsDaemon());
    const userDoc = new DIDDocumentFull(
      userDid,
      new Operator(
        user,
        { address: registry },
      ),
    );
    userClaims = new ClaimsUser(user, userDoc, store);

    const issuerDoc = new DIDDocumentFull(
      issuerDid,
      new Operator(
        issuer,
        { address: registry },
      ),
    );

    await userDoc.create();
    await issuerDoc.create();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('createPublicClaim should create token with claim data', async () => {
    const publicData = {
      name: 'John',
    };
    const token = await userClaims.createPublicClaim(publicData);
    (await userClaims.verifyPublicClaim(token, publicData)).should.be.true;
    const claim = await userClaims.jwt.verify(
      token, userClaims.keys.publicKey, { noTimestamp: true },
    );
    claim.should.deep.include({
      did: userDid,
      signer: userDid,
      claimData: publicData,
    });
  });

  it('creates and verifies 100 claims', async () => {
    const claims: { token: string; data: object }[] = [];
    for (let i = 0; i < 100; i++) {
      const data = { name: 'John', lastName: 'Doe', index: i };
      // eslint-disable-next-line no-await-in-loop
      claims.push({ token: (await userClaims.createPublicClaim(data)), data });
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const { token, data } of claims) {
      // eslint-disable-next-line no-await-in-loop
      (await userClaims.verifyPublicClaim(token, data)).should.be.true;
    }
  });

  it('createPrivateToken should create token with data decryptable by issuer', async () => {
    const secret = '123';
    const { token, saltedFields } = await userClaims.createPrivateClaim({ secret }, issuerDid);
    const claim = userClaims.jwt.decode(token, { noTimestamp: true }) as IPrivateClaim;
    const decrypted = decrypt(
      issuerKeys.privateKey,
      Buffer.from(claim.claimData.secret as string, 'hex'),
    );
    decrypted.toString().should.equal(saltedFields.secret);
  });

  it('createProofClaim should return well formed proof claim', async () => {
    const claimUrl = 'http://test.com';
    const proofData = { secret: { value: '123abc', encrypted: true } };
    const token = await userClaims.createProofClaim(claimUrl, proofData);
    const claim = await userClaims.jwt.verify(token, userClaims.keys.publicKey, { noTimestamp: true }) as IProofClaim;
    claim.should.include({ did: userDid, signer: userDid, claimUrl });
    claim.should.have.nested.property('proofData.secret.value.h').which.instanceOf(Array);
    claim.should.have.nested.property('proofData.secret.value.s').which.instanceOf(Array);
  });

  it('self signed claim should be verified', async () => {
    const claim = await userClaims.createPublicClaim(claimData);

    const url = await userClaims.publishPublicClaim(claim, claimData);

    return userClaims.verify(url).should.be.fulfilled;
  });

  /**
   * publicKeyHex property of W3C security vocab does not have 0x prefix
   * However, historically, some keys were added to DID Documents with a 0x prefix
   * Therefore, the verification should be able to handle both.
   * https://w3c-ccg.github.io/security-vocab/#publicKeyHex
   * https://w3c-ccg.github.io/lds-ecdsa-secp256k1-2019/
   */
  it('verifies claim of user with secp256k1 key with 0x prefix', async () => {
    const keys = new Keys();
    const address = keys.getAddress();
    const did = `did:${Methods.Erc1056}:${address}`;
    const signerWithHexPrefixKey = EwSigner.fromPrivateKey(userKeys.privateKey, providerSettings);
    const compressedSecp256k1KeyLength = 66; // Expected that key is compressed without hex prefix
    signerWithHexPrefixKey.publicKey.length.should.equal(compressedSecp256k1KeyLength);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    signerWithHexPrefixKey.publicKey = `0x${signerWithHexPrefixKey.publicKey}`;

    const doc = new DIDDocumentFull(
      did,
      new Operator(
        signerWithHexPrefixKey,
        { address: registry },
      ),
    );
    const userWithHexPrefixKey = new ClaimsUser(signerWithHexPrefixKey, doc, store);

    const claim = await userWithHexPrefixKey.createPublicClaim(claimData);
    const url = await userClaims.publishPublicClaim(claim, claimData);
    return userClaims.verify(url).should.be.fulfilled;
  });
});
