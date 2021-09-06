import { Signer, providers, utils } from 'ethers';

/**
 * A base signer class that encapsulates the ethers Signer.
 * The purpose of this encapsulation is to allow consumers more flexiblity in ethers version.
 */
export abstract class EwSigner extends Signer {
  constructor(
    public readonly signer: Signer,
  ) {
    super();
  }

  getAddress(): Promise<string> {
    return this.signer.getAddress();
  }

  sendTransaction(
    transaction: providers.TransactionRequest,
  ): Promise<providers.TransactionResponse> {
    return this.signer.sendTransaction(transaction);
  }

  signMessage(message: string | utils.Bytes): Promise<string> {
    return this.signer.signMessage(message);
  }

  signTransaction(transaction: providers.TransactionRequest): Promise<string> {
    return this.signer.signTransaction(transaction);
  }

  connect(provider: providers.Provider): Signer {
    return this.signer.connect(provider);
  }
}
