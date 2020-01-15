import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

import { Claim } from '../src';
import { IClaimData } from '../src/models';

describe('[CLAIM CLASS]', () => {
  let claimData: IClaimData;
  let publicClaim: Claim;
  before(() => {
    const keys = new Keys();
    const jwt = new JWT(keys);
    claimData = {
      did: `did:ewc:0x${keys.publicKey}`,
      test: 'test',
    };
    const data = {
      jwt,
      keyPair: keys,
      claimData,
    };
    publicClaim = new Claim(data);
  })
  it('Public Claim should return relevant DID Document', async () => {
    await publicClaim.getDid();

    expect(publicClaim.didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
    expect(publicClaim.didDocument.id).to.eql(claimData.did);
  });

  it('Public Claim should return relevant DID Document', async () => {
    const newKeys = new Keys();
    await publicClaim.getDid(`did:ewc:0x${newKeys.publicKey}`);

    expect(publicClaim.didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
    expect(publicClaim.didDocument.id).to.eql(`did:ewc:0x${newKeys.publicKey}`);
  });
});
