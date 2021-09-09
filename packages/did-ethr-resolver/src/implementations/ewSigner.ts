import {
  Signer, providers, utils, Wallet,
} from 'ethers';
import { ProviderSettings } from '@ew-did-registry/did-resolver-interface';
import { getProvider } from '../utils';

type EIP1193ProviderType = providers.ExternalProvider | providers.JsonRpcFetchFunc;

/**
 * A signer class that encapsulates the ethers Signer and ensures that publicKey is available.
 * The public is necessary for verification of signatures made by the signer.
 * The purpose of the ethers encapsulation is to allow consumers more flexiblity in ethers version.
 */
export class EwSigner extends Signer {
  /**
   * A private constructor as this class uses factory method for instantiation API.
   */
  private constructor(
    public readonly signer: Signer,
    public readonly publicKey: string,
    public readonly privateKey?: string,
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

  /**
   * A factory method to create an EwSigner from a private key.
    * ```typescript
    * import {
    *   Operator,
    *   EwSigner
    * } from '@ew-did-registry/did-ethr-resolver';
    * import { Keys } from '@ew-did-registry/keys';
    *
    * const keys = new Keys();
    * const providerSettings = { type: ProviderTypes.HTTP, };
    * const signer = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);
    * const operator = new Operator(signer, registrySettings);
    * ```
   * @param privateKey a secp256k1 private key.
   * @param providerSettings settings from which a web3 provider can be obtained
   */
  public static fromPrivateKey(privateKey: string, providerSettings: ProviderSettings): EwSigner {
    const provider = getProvider(providerSettings);
    const wallet = new Wallet(privateKey, provider);
    const compressedPubKey = utils.computePublicKey(wallet.publicKey, true);
    return new EwSigner(wallet, compressedPubKey.slice(2), privateKey);
  }

  /**
   * A factory method to create an EwSigner using an ethers library Provider.
   * This is convenient if a suitable ethers provider is available.
   * If instead an EIP1993 provider is available, see {@linkcode fromEIP1193}
   * @param provider an ethers JsonPrcProvider or Web3Provider, with an associated signer
   * @param publicKey the publicKey of the signer associated with the provider
   */
  // eslint-disable-next-line max-len
  public static fromEthersProvider(provider: providers.JsonRpcProvider, publicKey: string): EwSigner {
    return new EwSigner(provider.getSigner(), publicKey);
  }

  /**
  * A factory method to create an EwSigner without needing a specific ethers object.
  * Instead, any object which conforms to the necessary interface can be used.
  * See https://docs.ethers.io/v5/api/providers/other/#Web3Provider for interface description.
  *
  * @example
  * ```typescript
  * import { Operator, EwSigner } from '@ew-did-registry/did-ethr-resolver';
  * import detectMetamask from "@metamask/detect-provider";
  *
  * const web3Provider = await detectMetamask();
  * const web3Signer = EwSigner.fromEIP1193(web3Provider, publicKey);
  * const operator = new Operator(web3Signer, registrySettings);
  * ```
  * @param eip1993Provider an EIP1193 provider (https://docs.ethers.io/v5/api/providers/other/#Web3Provider)
  * @param publicKey the publicKey of the signer associated with the provider
  */
  public static fromEIP1193(eip1993Provider: EIP1193ProviderType, publicKey: string): EwSigner {
    const provider = new providers.Web3Provider(eip1993Provider);
    return new EwSigner(provider.getSigner(), publicKey);
  }
}
