export class JwtVerificationFailed extends Error {
  constructor() {
    super('Jwt verification failed');
  }
}
