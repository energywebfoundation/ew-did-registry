/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { IKeys } from '@ew-did-registry/keys';
import {
  Signer, providers, Wallet,
} from 'ethers';

export const signerFromKeys = (keys: IKeys): Signer => new Wallet(keys.privateKey);

export class ConnectedSigner extends Signer {
  readonly provider: providers.Provider;

  constructor(private signer: Signer, provider: providers.Provider) {
    super();
    const signerProto = Object.getPrototypeOf(signer);
    for (const propName of Object.keys(signerProto)) {
      const propDesc = Object.getOwnPropertyDescriptor(signerProto, propName) as PropertyDescriptor;
      const { value, get } = propDesc;
      if ((typeof value === 'function' || typeof get === 'function') && propName !== 'constructor') {
        Object.defineProperty(
          this,
          propName,
          Object.getOwnPropertyDescriptor(signerProto, propName) as PropertyDescriptor,
        );
      }
    }
    for (const [propName, prop] of Object.entries(signer)) {
      if (propName !== 'provider') {
        Object.defineProperty(this, propName, { value: prop });
      }
    }
    this.provider = provider;
  }

  getAddress(): Promise<string> {
    return this.signer.getAddress.bind(this)();
  }

  sendTransaction(tx: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    return this.signer.sendTransaction.bind(this)(tx);
  }

  signMessage(msg: string): Promise<string> {
    return this.signer.signMessage.bind(this)(msg);
  }

  signTransaction(tx: providers.TransactionRequest): Promise<string> {
    return this.signer.signTransaction.bind(this)(tx);
  }

  connect(provider: providers.Provider): Signer {
    throw new Error('Method not implemented.');
  }
}
