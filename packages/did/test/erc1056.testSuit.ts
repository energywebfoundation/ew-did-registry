import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import {
  Methods,
  isValidErc1056,
  Chain,
  isValidErc1056EWC
} from '../src';

export function erc1056tests(): void {
  it('Well-formed did should be validated', () => {
    const did = `did:${Methods.Erc1056}:${new Keys().getAddress()}`;
    expect(isValidErc1056(did)).true;
  });

  it('Well-formed did with chain name should be validated', () => {
    const did = `did:${Methods.Erc1056}:${Chain.EWC}:${new Keys().getAddress()}`;
    expect(isValidErc1056EWC(did)).true;
  });

  it('Method-specific id should be 40 digit hexadecimal value', () => {
    expect(isValidErc1056(`did:${Methods.Erc1056}:0x${'a'.repeat(41)}`)).throws;
  });
}
