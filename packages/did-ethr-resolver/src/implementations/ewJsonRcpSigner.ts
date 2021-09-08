import { providers } from 'ethers';
import { EwSigner } from './ewSigner';

type EIP1193ProviderType = providers.ExternalProvider | providers.JsonRpcFetchFunc;

/**
 * An encapsulation of an ethers JsonRpcSigner.
 * This is to allow consumers more flexibility in the ethers version they can use.
 */
export class EwJsonRpcSigner extends EwSigner {
  /**
   * A private constructor as this class uses factory method for instantiation API.
   */
  private constructor(provider: providers.JsonRpcProvider | providers.Web3Provider) {
    const signer = provider.getSigner();
    super(signer);
  }

  /**
   * Allows the creation of EwJsonRpcSigner using an ethers library Provider.
   * This is convenient if a suitable ethers provider is available.
   * If instead an EIP1993 provider is available, see {@linkcode fromEIP1193}
   * @param provider an ethers JsonPrcProvider or Web3Provider, with an associated signer
   */
  // eslint-disable-next-line max-len
  public static fromEthersProvider(provider: providers.JsonRpcProvider | providers.Web3Provider): EwJsonRpcSigner {
    return new EwJsonRpcSigner(provider);
  }

  /**
  * A factory method to create a EwJsonRpcSigner without needing a specific ethers object.
  * Instead, any object which conforms to the necessary interface can be used.
  * See https://docs.ethers.io/v5/api/providers/other/#Web3Provider for interface description.
  *
  * @example
  * ```typescript
  * import { Operator, IdentityOwner, EwJsonRpcSigner } from '@ew-did-registry/did-resolver';
  * import detectMetamask from "@metamask/detect-provider";
  *
  * const web3Provider = await detectMetamask();
  * const web3Signer = EwJsonRpcSigner.fromEIP1193(web3Provider);
  * const web3IdentityOwner = IdentityOwner.fromJsonRpcSigner(web3Signer, publicKey);
  *
  * const operator = new Operator(web3IdentityOwner, registrySettings);
  * ```
  * @param eip1993Provider an EIP1193 provider (https://docs.ethers.io/v5/api/providers/other/#Web3Provider)
  */
  public static fromEIP1193(eip1993Provider: EIP1193ProviderType): EwJsonRpcSigner {
    const provider = new providers.Web3Provider(eip1993Provider);
    return new EwJsonRpcSigner(provider);
  }
}
