import { EwJsonRpcSigner } from "./ewJsonRcpSigner";
import { EwPrivateKeySigner } from "./ewPrivateKeySigner";
import { EwSigner } from "./ewSigner";

/**
* Extends EwSigner with a publicKey that is associated with the signer.
* Intended to be instantiated from existing signers.
*/
export class IdentityOwner extends EwSigner {
    /**
     * @param signer an EwJsonRpcSigner
     * @param publicKey Public key associated with signer.
     * Isn't a prop of signer as signature is needed to derive.
     * @returns IdentityOwner that uses the passed in signer
     */
    public static fromJsonRpcSigner(signer: EwJsonRpcSigner, publicKey: string): IdentityOwner {
        return new IdentityOwner(signer, publicKey);
    }

    /**
     * @param signer an EwPrivateKeySigner
     * @returns IdentityOwner that uses the passed in signer
     */
    public static fromPrivateKeySigner(signer: EwPrivateKeySigner): IdentityOwner {
        return new IdentityOwner(signer, signer.publicKey);
    }

    private constructor(
        ewsigner: EwSigner,
        public readonly publicKey: string,
    ) {
        super(ewsigner.signer);
    }
}