import { expect } from 'chai';
import { Keys } from '@fl-did-registry/keys';
import { Methods, isValidErc1056 } from '../src';

export function erc1056tests(): void {
  it('Well-formed did should be validated', () => {
    const did = `did:${Methods.Erc1056}:${new Keys().getAddress()}`;
    expect(isValidErc1056(did)).true;
  });

  it('Method-specific id should be 40 digit hexadecimal value', () => {
    expect(isValidErc1056(`did:${Methods.Erc1056}:0x${'a'.repeat(41)}`)).throws;
  });
}
