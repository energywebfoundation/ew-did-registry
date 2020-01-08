import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

import { Claim } from '../src';

describe('[CLAIM CLASS]', () => {
  it('Public Claim should return relevant DID Document', async () => {
    const keys = new Keys();
    const jwt = new JWT(keys);
    const claimData = {
      did: `did:ewc:0x${keys.publicKey}`,
      test: 'test',
    };
    const data = {
      jwt,
      keyPair: keys,
      claimData,
    };
    const publicClaim = new Claim(data);
    await publicClaim.getDid();

    expect(publicClaim.didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
    expect(publicClaim.didDocument.id).to.eql(claimData.did);
  });
});
