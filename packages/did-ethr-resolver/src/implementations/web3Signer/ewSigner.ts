import { Signer, providers, utils } from "ethers";

/**
 * A base signer class that encapsulates the ethers Signer.
 */
export abstract class EwSigner extends Signer {
    constructor(
        public readonly signer: Signer,
    ) {
        super();
    }

    getAddress() {
        return this.signer.getAddress();
    }

    sendTransaction(transaction: providers.TransactionRequest) {
        return this.signer.sendTransaction(transaction);
    }

    signMessage(message: string | utils.Bytes): Promise<string> {
        return this.signer.signMessage(message);
    }

    signTransaction(transaction: providers.TransactionRequest) {
        return this.signer.signTransaction(transaction);
    }

    connect(provider: providers.Provider) {
        return this.signer.connect(provider);
    }
}