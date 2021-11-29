import assert from 'assert';
import { Wallet } from 'ethers';
import ECKey from 'ec-key';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from '@ew-did-registry/jwt';
import { ProofVerifier } from '../src/claimsVerifier/proofVerifier';
import { mockDocument } from './testUtils/mockDidDocuments';
import { Methods } from '@ew-did-registry/did';
import { Keys } from '@ew-did-registry/keys';
import {
  IAuthentication,
  IPublicKey,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';

const payload = {
  claimType: 'user.roles.example1.apps.john.iam.ewc',
  claimData: {
    blockNumber: 42,
    text: 'In EWC we trust',
  },
};
const identity = Wallet.createRandom();
const DID = `did:${Methods.Erc1056}:${identity.address}`;

type delegateType = {
  privKey: string;
  publicKey: string;
  address: string;
};

type ES256claimCreator = (signer: delegateType) => Promise<string>;
type EIP191ClaimCreator = (signer?: Wallet | Keys) => Promise<string>;

const createEIP191claim = async (signer?: Wallet | Keys) => {
  if (!signer) {
    signer = identity;
  }
  return new JWT(signer).sign({
    ...payload,
    iss: DID,
  });
};

const createES256claim = async (signer: {
  privKey: { toString: (arg0: string) => jsonwebtoken.Secret };
}) =>
  jsonwebtoken.sign(payload, signer.privKey.toString('pem'), {
    algorithm: 'ES256',
    noTimestamp: true,
    issuer: DID,
  });

describe('AuthTokenVerifier', () => {
  let verifier: ProofVerifier;
  let claim: string;
  let delegate: Wallet | Keys | delegateType;

  describe('Authenticate as identity', () => {
    it('should authenticate with empty document', async () => {
      claim = await createEIP191claim(identity);
      const document = mockDocument(identity, {
        withOwnerKey: false,
      });
      verifier = new ProofVerifier(document);
      const did = await verifier.authenticate(claim);

      assert.strictEqual(did, document.id);
    });

    it('should not authenticate with other identity document', async () => {
      claim = await createEIP191claim(identity);
      const document = mockDocument(Wallet.createRandom(), {
        withOwnerKey: false,
      });
      verifier = new ProofVerifier(document);
      const did = await verifier.authenticate(claim);

      assert.strictEqual(did, null);
    });
  });

  describe('Authenticate as delegate', () => {
    let createClaim: EIP191ClaimCreator | ES256claimCreator;

    const delegateTests = (claimCreatorType: string) => {
      it('sigAuth delegate should be authenticated', async () => {
        if (delegate instanceof Wallet) {
          const document = mockDocument(identity);
          document.publicKey.push({
            id: `did:${Methods.Erc1056}:${delegate.address}#${PubKeyType.SignatureAuthentication2018}`,
            type: PubKeyType.SignatureAuthentication2018,
            publicKeyHex: delegate.publicKey,
          } as IPublicKey);
          verifier = new ProofVerifier(document);
          claim = await createClaim(delegate as (Wallet | Keys) & delegateType);
          const did = await verifier.authenticate(claim);

          assert.strictEqual(did, document.id);
        }
      });

      it('authentication delegate should be authenticated', async () => {
        delegate =
          claimCreatorType === 'EIP191'
            ? (delegate as delegateType)
            : (delegate as Wallet);
        const document = mockDocument(identity);
        document.publicKey.push({
          id: `did:${Methods.Erc1056}:${delegate.address}#${PubKeyType.VerificationKey2018}`,
          type: PubKeyType.VerificationKey2018,
          publicKeyHex: delegate.publicKey,
        } as IPublicKey);
        document.authentication.push({
          publicKey: `did:${Methods.Erc1056}:${delegate.address}#delegate`,
        } as IAuthentication);
        verifier = new ProofVerifier(document);
        claim = await createClaim(delegate as (Wallet | Keys) & delegateType);
        const did = await verifier.authenticate(claim);

        assert.strictEqual(did, document.id);
      });

      it('should reject authentication with mismatching DID doc', async () => {
        const document = mockDocument(identity);
        verifier = new ProofVerifier(document);
        claim = await createClaim(delegate as (Wallet | Keys) & delegateType);
        const did = await verifier.authenticate(claim);

        assert.strictEqual(did, null);
      });
    };

    describe('With ethers.Signer', () => {
      before(() => {
        delegate = Wallet.createRandom();
        createClaim = createEIP191claim;
      });
      delegateTests('EIP191');
    });

    describe('With Keys signer', () => {
      before(() => {
        delegate = new Keys();
        createClaim = createEIP191claim;
      });

      delegateTests('EIP191');
    });

    describe('With P256 signer', () => {
      before(() => {
        createClaim = createES256claim;
        const privKey = ECKey.createECKey('prime256v1');
        const publicKey = `0x${privKey.publicCodePoint.toString('hex')}`;
        delegate = {
          privKey,
          publicKey,
          address: publicKey,
        };
      });
      delegateTests('ES256');
    });
  });
});
