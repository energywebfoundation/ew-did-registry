import { Wallet } from 'ethers';
import { ProviderSettings } from '@ew-did-registry/did-resolver-interface';
import { EwSigner } from './ewSigner';
import { getProvider } from '../utils';

/**
* Enables the ability to sign trasactions with a privateKey
*
* @example
* ```typescript
* import {
*   Operator,
*   IdentityOwner,
*   EwPrivateKeySigner
* } from '@ew-did-registry/did-resolver';
* import { Keys } from '@ew-did-registry/keys';
*
* const keys = new Keys();
* const providerSettings = { type: ProviderTypes.HTTP, };
* const signer = new EwPrivateKeySigner(keys.privateKey, providerSettings);
* const IdentityOwner = IdentityOwner.fromPrivateKeySigner(signer);
*
* const operator = new Operator(IdentityOwner, registrySettings);
* ```
* @param privateKey: privateKey of the identity owner
* @param providerSettings: Settings to connect to Ethr provider
*/
export class EwPrivateKeySigner extends EwSigner {
  private readonly _wallet: Wallet;

  private readonly _privateKey: string;

  private _provider: providers.Provider;

  constructor(privateKey: string, providerSettings: ProviderSettings) {
    const provider = getProvider(providerSettings);
    const wallet = new Wallet(privateKey, provider);
    super(wallet);
    this._wallet = wallet;
    this._privateKey = privateKey;
  }

  get publicKey(): string {
    return this._wallet.publicKey;
  }

  get privateKey(): string {
    return this._privateKey;
  }
}
