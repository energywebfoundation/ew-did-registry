import { Keys } from '../packages/keys';
import { Operator } from '../packages/did-ethr-resolver';
import DIDRegistry from '../packages/did-registry';
import { DidStore } from '../packages/did-ipfs-store';
import { Methods } from '../packages/did';
import { getSettings, spawnIpfsDaemon, shutDownIpfsDaemon } from '.';

export const createAndStoreClaim = async (): Promise<string> => {
  const keys = new Keys();
  const did = `did:${Methods.Erc1056}:${keys.getAddress()}`;
  const resolverSettings = await getSettings([]);
  const store = new DidStore(await spawnIpfsDaemon());
  const user = new DIDRegistry(keys, did, new Operator(keys, resolverSettings), store);
  const userClaims = user.claims.createClaimsUser();
  const claim = await userClaims.createPublicClaim({ name: 'John' });
  localStorage.setItem('EW-DID-CONFIG', claim);
  await shutDownIpfsDaemon();
  return claim;
};
