import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import {
  isCredential,
  isPresentation,
  isVerifiableCredential,
  isVerifiablePresentation,
} from '../src/credential.utils';

use(sinonChai);

describe('[CREDENTIALS INTERFACE PACKAGE] Credentials utils', () => {
  it('should check valid credential', () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      id: 'did:example:123456789abcdefghi#key1',
      credentialSubject: {
        id: 'did:example:foo',
      },
      issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
      issuanceDate: '2021-03-18T16:38:25Z',
    };
    const valid = isCredential(credential);
    expect(valid).to.be.true;
  });

  it('should result in false for invalid credential', () => {
    const credential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
        id: 'did:example:foo',
      },
      issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
      issuanceDate: '2021-03-18T16:38:25Z',
    };
    const valid = isCredential(credential);
    expect(valid).to.be.false;
  });

  it('should check valid verifiable credential', () => {
    const verifiableCredential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      id: 'did:example:123456789abcdefghi#key1',
      credentialSubject: {
        id: 'did:example:foo',
      },
      issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
      issuanceDate: '2021-03-18T16:38:25Z',
      proof: {
        '@context': 'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
        type: 'EthereumEip712Signature2021',
        proofPurpose: 'assertionMethod',
        proofValue:
          '0x9abee96d684a146aa0b30498d8799ee9a4f8f54488c73d4a4fba3a6fb94eca8764af54f15a24deba0dd9ee2f460d1f6bd174a4ca7504a72d6b1fe9b739d613fe1b',
        verificationMethod:
          'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758#Recovery2020',
        created: '2021-06-17T17:16:39.791Z',
      },
    };
    const valid = isVerifiableCredential(verifiableCredential);
    expect(valid).to.be.true;
  });

  it('should result in false for invalid verifiable credential', () => {
    const verifiableCredential = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      id: 'did:example:123456789abcdefghi#key1',
      credentialSubject: {
        id: 'did:example:foo',
      },
      issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
      issuanceDate: '2021-03-18T16:38:25Z',
      proof: {
        '@context': 'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
        type: 'EthereumEip712Signature2021',
        proofPurpose: 'assertionMethod',
        verificationMethod:
          'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758#Recovery2020',
        created: '2021-06-17T17:16:39.791Z',
      },
    };
    const valid = isVerifiableCredential(verifiableCredential);
    expect(valid).to.be.false;
  });

  it('should check valid presentation', () => {
    const presentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      holder: 'did:example:123456789abcdefghi#key1',
      id: 'did:example:123456789abcdefghi#key1',
      verifiableCredential: [
        {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          id: 'did:example:123456789abcdefghi#key1',
          credentialSubject: {
            id: 'did:example:foo',
          },
          issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
          issuanceDate: '2021-03-18T16:38:25Z',
          proof: {
            '@context':
              'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
            type: 'EthereumEip712Signature2021',
            proofPurpose: 'assertionMethod',
            proofValue:
              '0x9abee96d684a146aa0b30498d8799ee9a4f8f54488c73d4a4fba3a6fb94eca8764af54f15a24deba0dd9ee2f460d1f6bd174a4ca7504a72d6b1fe9b739d613fe1b',
            verificationMethod:
              'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758#Recovery2020',
            created: '2021-06-17T17:16:39.791Z',
          },
        },
      ],
    };

    const valid = isPresentation(presentation);
    expect(valid).to.be.true;
  });

  it('should result in false for invalid presentation', () => {
    const presentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      holder: 'did:example:123456789abcdefghi#key1',
    };
    const valid = isPresentation(presentation);
    expect(valid).to.be.false;
  });

  it('should check valid verifiable presentation', () => {
    const verifiablePresentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      holder: 'did:example:123456789abcdefghi#key1',
      id: 'did:example:123456789abcdefghi#key1',
      verifiableCredential: [
        {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          id: 'did:example:123456789abcdefghi#key1',
          credentialSubject: {
            id: 'did:example:foo',
          },
          issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
          issuanceDate: '2021-03-18T16:38:25Z',
          proof: {
            '@context':
              'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
            type: 'EthereumEip712Signature2021',
            proofPurpose: 'assertionMethod',
            proofValue:
              '0x9abee96d684a146aa0b30498d8799ee9a4f8f54488c73d4a4fba3a6fb94eca8764af54f15a24deba0dd9ee2f460d1f6bd174a4ca7504a72d6b1fe9b739d613fe1b',
            verificationMethod:
              'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758#Recovery2020',
            created: '2021-06-17T17:16:39.791Z',
          },
        },
      ],
      proof: {
        '@context': 'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
        type: 'EthereumEip712Signature2021',
        proofPurpose: 'assertionMethod',
        proofValue:
          '0x9abee96d684a146aa0b30498d8799ee9a4f8f54488c73d4a4fba3a6fb94eca8764af54f15a24deba0dd9ee2f460d1f6bd174a4ca7504a72d6b1fe9b739d613fe1b',
        verificationMethod:
          'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758#Recovery2020',
        created: '2021-06-17T17:16:39.791Z',
      },
    };
    const valid = isVerifiablePresentation(verifiablePresentation);
    expect(valid).to.be.true;
  });

  it('should result in false for invalid verifiable presentation', () => {
    const verifiablePresentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      holder: 'did:example:123456789abcdefghi#key1',
      verifiableCredentials: [
        {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          id: 'did:example:123456789abcdefghi#key1',
          credentialSubject: {
            id: 'did:example:foo',
          },
          issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
          issuanceDate: '2021-03-18T16:38:25Z',
          proof: {
            '@context':
              'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
            type: 'EthereumEip712Signature2021',
            proofPurpose: 'assertionMethod',
            proofValue:
              '0x9abee96d684a146aa0b30498d8799ee9a4f8f54488c73d4a4fba3a6fb94eca8764af54f15a24deba0dd9ee2f460d1f6bd174a4ca7504a72d6b1fe9b739d613fe1b',
            verificationMethod:
              'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758#Recovery2020',
            created: '2021-06-17T17:16:39.791Z',
          },
        },
      ],
      proof: {
        '@context': 'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
        type: 'EthereumEip712Signature2021',
        proofPurpose: 'assertionMethod',
        proofValue:
          '0x9abee96d684a146aa0b30498d8799ee9a4f8f54488c73d4a4fba3a6fb94eca8764af54f15a24deba0dd9ee2f460d1f6bd174a4ca7504a72d6b1fe9b739d613fe1b',
        created: '2021-06-17T17:16:39.791Z',
      },
    };
    const valid = isVerifiablePresentation(verifiablePresentation);
    expect(valid).to.be.false;
  });
});
