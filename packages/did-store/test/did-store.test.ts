import { Keys } from '@ew-did-registry/keys';
import { DidStore } from '../src';

describe('[DID-STORE PACKAGE]', function () {
  this.timeout(0);

  it('register() should return DID', async () => {
    const keys = new Keys();
    const did = await DidStore.register(keys.privateKey, 'http:localhost:8080');
    console.log('>>> registered did:', did);
    const store = new DidStore(did, keys.privateKey, 'htt://localhost:8080');
    const objectIds = await store.getObjectIds();
    console.log('>>> object ids:', objectIds);
  });
});
