const { expect } = require('chai');

describe('[EW-DID-REGISTRY]', () => {
  it('The browser should have objects exporting the functionality of all library packages', async () => {
    console.log('keys: ', Object.keys(keys));
    expect(keys).to.have.property('Keys');
    console.log('claims: ', Object.keys(claims));
    expect(claims).to.have.property('ClaimsFactory');
  });
});
