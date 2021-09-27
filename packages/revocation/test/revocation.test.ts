import chai, { expect , assert, should} from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { deployRevocationRegistry } from '../../../tests';
import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { Operator, EwSigner } from '@ew-did-registry/did-ethr-resolver';
import { Revocation } from '../src/implementations/revocation';
chai.should();
const { fail } = assert;

describe('[REVOCATION CLAIMS]', function () {
  this.timeout(0);
  
  let revocationRegistry: Revocation;
  const userKeys = new Keys();
  const userAddress = userKeys.getAddress();
  const userRole = "user";
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;
  const revokerKeys = new Keys();
  const revokerAddress = revokerKeys.getAddress();
  const ownerKeys = new Keys();
  const ownerAddress = ownerKeys.getAddress();
  const revokerRole = "revoker";
  const revokerDID = `did:${Methods.Erc1056}:${revokerAddress}`;
  const providerSettings: ProviderSettings = {
    type: ProviderTypes.HTTP,
  };
  const revoker = EwSigner.fromPrivateKey(revokerKeys.privateKey, providerSettings);

  beforeEach(async () => {
    const registryOffChain = await deployRevocationRegistry([revokerAddress]);
    revocationRegistry = new Revocation(revoker, registryOffChain, registryOffChain);
  });

    it('Revoker can revoke a role', async () => {
      
      await revocationRegistry.revokeOffChainRole(userRole, userDid );
      expect(await revocationRegistry.isRoleRevoked(userRole, userDid, false)).true;
    });

    // it('A role cannot be revoked again', async () => {
      
    //   await revocationRegistry.revokeOffChainRole(userRole, userDid );
    //   expect(await revocationRegistry.isRoleRevoked(userRole, userDid, false)).true;
    //   expect(await revocationRegistry.revokeOffChainRole(userRole, userDid)).rejectedWith("The claim is already revoked");
    // });

    it('User DID needs to be valid', async () => {
      try {
        await revocationRegistry.revokeOffChainRole(userRole, "somerandomstringnotDID");
        fail('Error was not thrown');
      } catch (e) {
        expect(e.message).to.equal('Invalid DID');
      }
      expect(await revocationRegistry.isRoleRevoked(userRole, userDid, false)).false;
    });

    it('Revoker address can be fetched for a revoked role', async () => {
      
      await revocationRegistry.revokeOffChainRole(userRole, userDid );
      expect(await revocationRegistry.isRoleRevoked(userRole, userDid, false)).true;
      expect(await revocationRegistry.getRevoker(userRole, userDid)).equal(revokerAddress);
    });
  
});
