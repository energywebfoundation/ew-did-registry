export class NoStatusList extends Error {
  constructor(statusListUrl: string) {
    super(`StatusList2021 ${statusListUrl} does not exists`);
  }
}

export class InvalidStatusList extends Error {
  constructor(errors: string[]) {
    super(`StatusList credential is invalid, error: ${errors.join(',')}`);
  }
}

export class CredentialRevoked extends Error {
  constructor() {
    super('Credential has been revoked');
  }
}

export class InsecureStatusList extends Error {
  constructor(url: string) {
    super(`Insecure status list request ${url}`);
  }
}
