import { ClaimsFactory } from '../packages/claims';
import { Keys } from '../packages/keys/dist';
import { Resolver } from '../packages/did-resolver/dist';
import { getSettings } from './init-ganache';

export const createAndStoreClaim = async (): Promise<string> => {
  const resolverSettings = await getSettings([]);
  const userClaims = new ClaimsFactory(new Keys(), new Resolver(resolverSettings)).createClaimsUser();
  const claim = await userClaims.createPublicClaim({ name: 'John' });
  localStorage.setItem('EW-DID-CONFIG', claim);
  return claim;
};
