import { verifyCredential } from 'didkit-wasm-node';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import { CredentialStatusPurpose } from '@ew-did-registry/credentials-interface';
import {
  StatusListEntryVerification,
  CredentialRevoked,
  InsecureStatusList,
} from '../src';
import {
  credentialStatus,
  statusListWithRevokedStatus,
} from './fixtures/credentials';

chai.use(chaiAsPromised);

describe('[StatusList2021Entry verification]', function () {
  let verification: StatusListEntryVerification;

  beforeEach(async () => {
    verification = new StatusListEntryVerification(verifyCredential);
  });

  it('Credential status should not be verified over insecure connection', async () => {
    return expect(
      verification.verifyCredentialStatus({
        ...credentialStatus,
        statusListCredential: '',
      })
    ).rejectedWith(InsecureStatusList);
  });

  it('Credential status with non revocation purpose should not be verified', async () => {
    return expect(
      verification.verifyCredentialStatus({
        ...credentialStatus,
        statusPurpose: '' as CredentialStatusPurpose,
      })
    ).rejectedWith('StatusList2021Entry does not have revocation purpose');
  });

  it('Non revoked credential status must be verified', async () => {
    nock(credentialStatus.statusListCredential).get('').reply(204, undefined);

    return expect(verification.verifyCredentialStatus(credentialStatus))
      .fulfilled;
  });

  it('Revoked credential status must not be verified', async () => {
    nock(credentialStatus.statusListCredential)
      .get('')
      .reply(200, statusListWithRevokedStatus);

    return expect(
      verification.verifyCredentialStatus(credentialStatus)
    ).rejectedWith(CredentialRevoked);
  });
});
