import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { deployRevocationRegistry } from '../../../tests';
import {
  ProviderSettings,
  ProviderTypes,
} from '@ew-did-registry/did-resolver-interface';
import { EwSigner } from '@ew-did-registry/did-ethr-resolver';
import { CredentialRevocation } from '../src/implementations/credential-revocation';

describe('[CREDENTIAL REVOCATION]', function () {
  let revocationRegistry: CredentialRevocation;
  let registryAddress: string;
  const credential = 'This is a test credential which states nothing';
  const revokerKeys = new Keys({});
  const revokerAddress = revokerKeys.getAddress();
  const providerSettings: ProviderSettings = {
    type: ProviderTypes.HTTP,
  };

  // To test with VOLTA, use the below providerSettings for EwSigner
  // const providerSettingsForVolta = {
  //   type: ProviderTypes.HTTP,
  //   uriOrInfo: 'https://volta-rpc.energyweb.org',
  // };
  const revoker = EwSigner.fromPrivateKey(
    revokerKeys.privateKey,
    providerSettings
  );

  beforeEach(async () => {
    registryAddress = await deployRevocationRegistry([
      await revoker.getAddress(),
    ]);
    // use 'revocationRegistryAddress' while testing with volta
    revocationRegistry = new CredentialRevocation(revoker, registryAddress);
  });

  it('Revoker can revoke a credential', async () => {
    expect(await revocationRegistry.revokeCredential(credential)).true;
  });

  it('A credential can be revoked multiple times', async () => {
    expect(await revocationRegistry.revokeCredential(credential)).true;
    expect(await revocationRegistry.revokeCredential(credential)).true;
  });

  it('Revoker for a credential can be fetched', async () => {
    expect(await revocationRegistry.revokeCredential(credential)).true;
    const result = await revocationRegistry.getRevocations(credential);
    expect(result.length).to.equal(2);
    expect(result[0][0]).equal(revokerAddress);
  });

  it('Revokers can be fetched for a credential revoked multiple times', async () => {
    expect(await revocationRegistry.revokeCredential(credential)).true;
    expect(await revocationRegistry.revokeCredential(credential)).true;
    const result = await revocationRegistry.getRevocations(credential);
    expect(result.length).to.equal(2);
    expect(result[0][0]).equal(revokerAddress);
    expect(result[0][1]).equal(revokerAddress);
  });
});
