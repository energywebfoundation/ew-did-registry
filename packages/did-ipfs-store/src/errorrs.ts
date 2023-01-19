export class ContentNotFound extends Error {
  constructor(cid: string, reason?: string) {
    super(
      `Content with identifier ${cid} was not found in DID Store ${
        reason ? `: ${reason}` : ''
      }`
    );
  }
}

// AbortError is not exported https://github.com/web-std/io/blob/c88170bf24f064adfbb3586a21fb76650ca5a9ab/packages/fetch/src/errors/abort-error.js#L6. Have to detect error type by name
export const AbortErrorName = 'AbortError';
