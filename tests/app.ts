import { Keys } from '../packages/keys';
import {
  Operator, signerFromKeys, ConnectedSigner, getProvider,
} from '../packages/did-ethr-resolver';
import DIDRegistry from '../packages/did-registry';
import { DidStore } from '../packages/did-ipfs-store';
import { Methods } from '../packages/did';
import { deployRegistry } from './init-ganache';

export const createAndStoreClaim = async (): Promise<string> => {
  const keys = new Keys();
  const did = `did:${Methods.Erc1056}:${keys.getAddress()}`;
  const registry = await deployRegistry([]);
  const store = new DidStore('http://mockApi');
  const user = new DIDRegistry(
    keys,
    did,
    new Operator(new ConnectedSigner(signerFromKeys(keys), getProvider()), { address: registry }),
    store,
  );
  const userClaims = user.claims.createClaimsUser();
  const claim = await userClaims.createPublicClaim({ name: 'John' });
  localStorage.setItem('EW-DID-CONFIG', claim);
  return claim;
};
