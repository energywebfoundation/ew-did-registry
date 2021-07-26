import { providers } from 'ethers';
import { EwSigner } from './ewSigner';

/**
* Enables the ability to sign trasactions using an EIP-1193 web3 provider like Metamask
*
* @example
* ```typescript
* import { Operator, IdentityOwner, EwJsonRpcSigner } from '@ew-did-registry/did-resolver';
* import detectMetamask from "@metamask/detect-provider";
*
* const web3Provider = await detectMetamask();
* const web3Signer = new EwJsonRpcSigner(web3Provider);
* const web3IdentityOwner = IdentityOwner.fromJsonRpcSigner(web3Signer, publicKey);
*
* const operator = new Operator(web3IdentityOwner, registrySettings);
* ```
* @param web3Provider: an EIP1193 provider
*/

type Web3ProviderType = providers.ExternalProvider | providers.JsonRpcFetchFunc;

export class EwJsonRpcSigner extends EwSigner {
  constructor(web3Provider: Web3ProviderType) {
    const jsonRpcSigner = new providers.Web3Provider(web3Provider).getSigner();
    super(jsonRpcSigner);
  }
}
