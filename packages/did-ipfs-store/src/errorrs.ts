export class ContentNotFound extends Error {
  constructor(cid: string, reason?: string) {
    super(
      `Content with identifier ${cid} was not found in DID Store ${
        reason ? `:${reason}` : ''
      }`
    );
  }
}
