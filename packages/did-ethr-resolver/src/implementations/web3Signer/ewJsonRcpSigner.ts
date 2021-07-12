import { providers } from "ethers";
import { EwSigner } from "./ewSigner";


// Example:
// import detectMetamask from "@metamask/detect-provider";
// const web3Provider = await detectMetamask()
// const web3IdentityOwner = Web3IdentityOwner.fromWeb3Provider(web3Provider)


// @param web3Provider: an EIP1193 provider
export class EwJsonRpcSigner extends EwSigner {
    publicKey: string | undefined;

    constructor(web3Provider: any) {
        const jsonRpcSigner = new providers.Web3Provider(web3Provider).getSigner();
        super(jsonRpcSigner);
    }
}