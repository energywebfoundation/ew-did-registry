import { providers } from 'ethers';
import { EwSigner } from './ewSigner';

type Web3ProviderType = providers.ExternalProvider | providers.JsonRpcFetchFunc;

/**
 * An encapsulation of an ethers JsonRpcSigner.
 * This is to allow consumers more flexibility in the ethers version they can use.
 */
export class EwJsonRpcSigner extends EwSigner {
  /**
   * Allows the creation of EwJsonRpcSigner using an ethers Provider.
   * This is convenient if a suitable ethers provider is available
   * @param provider an ethers JsonPrcProvider or Web3Provider, with an associated signer
   */
  constructor(provider: providers.JsonRpcProvider | providers.Web3Provider) {
    const signer = provider.getSigner();
    super(signer);
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
  * const web3Signer = EwJsonRpcSigner.fromWeb3Provider(web3Provider);
  * const web3IdentityOwner = IdentityOwner.fromJsonRpcSigner(web3Signer, publicKey);
  *
  * const operator = new Operator(web3IdentityOwner, registrySettings);
  * ```
  * @param web3Provider an EIP1193 provider (https://docs.ethers.io/v5/api/providers/other/#Web3Provider)
  */
  public static fromWeb3Provider(web3Provider: Web3ProviderType): EwJsonRpcSigner {
    const provider = new providers.Web3Provider(web3Provider);
    return new EwJsonRpcSigner(provider);
  }
}
