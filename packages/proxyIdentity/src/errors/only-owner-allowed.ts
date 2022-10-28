export class OnlyOwnerAllowed extends Error {
  constructor(identity: string, signer: string) {
    super(`Signer ${signer} is not allowed to update DID identity ${identity}`);
  }
}
