import { expect } from 'chai';

import { add } from '../src';

describe('add function', () => {
  it('should return 2', () => {
    expect(add(1, 1)).to.equal(2);
  });
});
