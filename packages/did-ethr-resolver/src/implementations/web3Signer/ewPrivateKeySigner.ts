import { EwSigner } from "./ewSigner";
import { providers, Wallet } from "ethers";

export class EwPrivateKeySigner extends EwSigner {
  private _wallet: Wallet;

  constructor(privateKey: string, rpcUrl: string) {
    const provider = new providers.JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);
    super(wallet);
    this._wallet = wallet;
  }

  get publicKey(): string {
    return this._wallet.publicKey;
  }
}