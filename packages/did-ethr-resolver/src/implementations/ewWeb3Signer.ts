import { providers, Signer, utils, Wallet } from "ethers";

export class Web3Signer extends Signer {
  
  public static fromPrivateKey(privateKey: string, rpcUrl: string): Web3Signer {
    const provider = new providers.JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(privateKey, provider);
    return new Web3Signer(wallet);
  }
  
  // Example:
  // import detectMetamask from "@metamask/detect-provider";
  // const web3Provider = await detectMetamask()
  // const web3IdentityOwner = Web3IdentityOwner.fromWeb3Provider(web3Provider)
  // @param web3Provider: an EIP1193 provider
  public static fromWeb3Provider(web3Provider: any) {
    const jsonRpcSigner = new providers.Web3Provider(web3Provider).getSigner()
    return new Web3Signer(jsonRpcSigner);
  }
  
  private constructor(
    private readonly signer: Signer
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

    signTransaction(transaction: providers.TransactionRequest){
        return this.signer.signTransaction(transaction)
    }

    connect(provider: providers.Provider){
        return this.signer.connect(provider);
    }
  }
  