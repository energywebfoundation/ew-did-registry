import {
  PrivateKey, JwsToken, CryptoFactory, RsaCryptoSuite, CryptoSuite,
} from '@decentralized-identity/did-auth-jose';
import { ICommitSigner, Commit, SignedCommit } from '@decentralized-identity/hub-sdk-js';
// import objectAssign from '';

interface CommitSignerOptions {

  /** The DID of the identity that will the commit. */
  did: string;

  /** The private key to be used to sign the commit. */
  key: PrivateKey;

  /** The CryptoSuite to be used to for the algorithm to use to sign the commit */
  cryptoSuite?: CryptoSuite;

}

/**
 * Class which can apply a signature to a commit.
 */
export class CommitSigner implements ICommitSigner {
  private did: string;

  private key: PrivateKey;

  private cryptoSuite: CryptoSuite;

  constructor(options: CommitSignerOptions) {
    this.did = options.did;
    this.key = options.key;
    if (!options.cryptoSuite) {
      this.cryptoSuite = new RsaCryptoSuite();
    } else {
      this.cryptoSuite = options.cryptoSuite;
    }
  }

  /**
   * Signs the given commit.
   *
   * @param commit The commit to sign.
   */
  public async sign(commit: Commit): Promise<SignedCommit> {

    commit.validate();

    const protectedHeaders = commit.getProtectedHeaders();

    // const finalProtectedHeaders = objectAssign({}, protectedHeaders, {
    //   iss: this.did,
    // });
    const finalProtectedHeaders = { ...protectedHeaders, iss: this.did };

    const jws = new JwsToken(commit.getPayload(), new CryptoFactory([this.cryptoSuite]));
    const signed = await jws.sign(this.key, finalProtectedHeaders);

    const [outputHeaders, outputPayload, outputSignature] = signed.split('.');

    return new SignedCommit({
      protected: outputHeaders,
      payload: outputPayload,
      header: commit.getUnprotectedHeaders(),
      signature: outputSignature,
    });
  }
}
