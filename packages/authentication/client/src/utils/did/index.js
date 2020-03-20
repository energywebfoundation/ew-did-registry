import { ClaimsUser } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { Networks } from '@ew-did-registry/did';
import { getSettings } from '../init-ganache';

export const identityKeys = new Keys();
const ownerKeys = new Keys();

export async function sendLoginClaim(did, privateKey) {
  const resolverSettings = await getSettings([identityKeys.getAddress(), ownerKeys.getAddress()]);
  console.log('>>> resolver settings:', resolverSettings);
  const keys = new Keys({ privateKey });
  const operator = new Operator(keys, resolverSettings);
  await operator.create();
  const claims = new ClaimsUser(keys, operator);
  const loginToken = await claims.createPublicClaim(
    {
      id: `did:${Networks.Ethereum}:${identityKeys.getAddress()}`, // already part of the claim
      network: Networks.Ethereum, // should be one of the Network values in did package
      registry: resolverSettings.address, // already in resolver settings
      action: "login",
      uri: "https://origin.energyweb.org",
    },
    { expiresIn: 60 }
  );
  console.log('>>> login token:', loginToken);
  const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
    method: 'POST',
    body: loginToken,
  });
  const body = await response.json();
  console.log('>>> login response:', body);
  return body.authenticated;
}

