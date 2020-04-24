import { ClaimsUser } from '@ew-did-registry/claims';
import { Keys } from '@ew-did-registry/keys';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { getSettings } from '../init-ganache';

export const defaultKeys = new Keys();

export async function sendAuthClaim(did, privateKey) {
  const keys = new Keys({ privateKey });
  const resolverSettings = await getSettings([keys.getAddress()]);
  console.log('>>> resolver settings:', resolverSettings);
  const operator = new Operator(keys, resolverSettings);
  await operator.create();
  const claims = new ClaimsUser(keys, operator);
  const loginToken = await claims.createPublicClaim(
    {
      id: `${did}`,
      registry: resolverSettings.address,
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
  return body;
}
