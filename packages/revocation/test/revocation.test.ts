import chai, { expect , assert } from 'chai';
import { providers } from 'ethers';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { deployRevocationRegistry } from '../../../tests';
import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { EwSigner } from '@ew-did-registry/did-ethr-resolver';
import { Revocation } from '../src/implementations/revocation';
const { fail } = assert;
const { JsonRpcProvider } = providers;

describe('[REVOCATION CLAIMS]', function () {
  const provider = new JsonRpcProvider('http://localhost:8544');
  let revocationRegistry: Revocation;
  let userDid : string;
  let registryOffChain : string;
  const user = provider.getSigner(7);
  const userRole = "user";
  let userAddress : string;
  const revokerKeys = new Keys({
    privateKey: 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
  });
  const revokerAddress = revokerKeys.getAddress();
  const providerSettings: ProviderSettings = {
    type: ProviderTypes.HTTP,
  };
  const revoker = EwSigner.fromPrivateKey(revokerKeys.privateKey, providerSettings);
  

  before(async () => {
    userAddress =await user.getAddress();
    userDid = `did:${Methods.Erc1056}:${userAddress}`;
  });

  beforeEach(async () => {
    registryOffChain = await deployRevocationRegistry();
    revocationRegistry = new Revocation(revoker, registryOffChain, registryOffChain);
  });

    it('Revoker can revoke a role', async () => {
      await revocationRegistry.revokeOffChainRole(userRole, userDid);
      expect (await revocationRegistry.isRoleRevoked(userRole, userDid, false)).true;
    });

    it('User DID needs to be valid', async () => {
      try {
        await revocationRegistry.revokeOffChainRole(userRole, "somerandomstringnotDID");
        fail('Error was not thrown');
      } catch (e) {
        expect(e.message).to.equal('Invalid DID');
      }
      expect(await revocationRegistry.isRoleRevoked(userRole, userDid, false)).false;
    });

    it('Revoker details can be fetched for a revoked off chain role', async () => {
      
      await revocationRegistry.revokeOffChainRole(userRole, userDid );
      expect(await revocationRegistry.isRoleRevoked(userRole, userDid, false)).true;
      
      const result = await revocationRegistry.getRevocationDetail(userRole, userDid, false);
      expect(result.length).to.equal(2);
      expect(result[0]).equal(revokerAddress);

    });
});
