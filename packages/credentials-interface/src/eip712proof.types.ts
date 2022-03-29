import { TypedDataField } from '@ethersproject/abstract-signer';

export interface EIP712Proof {
  // ! Need to add index signature to be compatible with PEX type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: string | string[] | any;
  '@context': string | string[];
  type: string;
  proofPurpose: string;
  proofValue: string;
  verificationMethod: string;
  created: string;
  eip712Domain: {
    domain: Record<string, string>;
    messageSchema: Record<string, TypedDataField[]>;
    primaryType: string;
  };
}
