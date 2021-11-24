import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import {
  Methods,
  isValidErc1056,
  Chain,
  isValidErc1056EWC,
  getDIDChain,
  getDIDMethod,
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

  it('DID method can be retrieved for well formed did', () => {
    const did = `did:${Methods.Erc1056}:${new Keys().getAddress()}`;
    expect(getDIDMethod(did)).equals(Methods.Erc1056);
  });

  it('DID method can be retrieved for well formed did with chain name', () => {
    const did = `did:${Methods.Erc1056}:${Chain.EWC}:${new Keys().getAddress()}`;
    expect(getDIDMethod(did)).equals(Methods.Erc1056);
  });

  it('Chain name can be retrieved for well formed did', () => {
    const did = `did:${Methods.Erc1056}:${Chain.EWC}:${new Keys().getAddress()}`;
    expect(getDIDChain(did)).deep.equal({foundChainInfo : true, chainInfo : Chain.EWC});
  });

  it('Chain name cannot be retrieved for did without chain info', () => {
    const did = `did:${Methods.Erc1056}:${new Keys().getAddress()}`;
    expect(getDIDChain(did)).deep.equal({foundChainInfo : false, chainInfo : undefined});
  });
}
