const { expect } = require('chai');

describe('[EW-DID-REGISTRY]', () => {
  it('Typescript application should be bundled to run in browser', async () => {
    const createdClaim = await app.createAndStoreClaim();
    const savedClaim = localStorage.getItem('EW-DID-CONFIG');
    expect(createdClaim).equal(savedClaim);
  });
});
