/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { IKeys } from '@ew-did-registry/keys';
import { ethers, Signer } from 'ethers';
import { Provider, TransactionResponse, TransactionRequest } from 'ethers/providers';

export const signerFromKeys = (keys: IKeys): Signer => new ethers.Wallet(keys.privateKey);

export class ConnectedSigner extends Signer {
  readonly provider: Provider;

  constructor(private signer: Signer, provider: Provider) {
    super();
    const signerProto = Object.getPrototypeOf(signer);
    for (const propName of Object.keys(signerProto)) {
      const propDesc = Object.getOwnPropertyDescriptor(signerProto, propName);
      const { value, get } = propDesc;
      if ((typeof value === 'function' || typeof get === 'function') && propName !== 'constructor') {
        Object.defineProperty(
          this,
          propName,
          Object.getOwnPropertyDescriptor(signerProto, propName),
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

  sendTransaction(tx: TransactionRequest): Promise<TransactionResponse> {
    return this.signer.sendTransaction.bind(this)(tx);
  }

  signMessage(msg: string): Promise<string> {
    return this.signer.signMessage.bind(this)(msg);
  }
}
