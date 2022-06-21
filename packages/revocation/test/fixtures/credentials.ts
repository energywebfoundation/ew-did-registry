import {
  CredentialStatusType,
  CredentialStatusPurpose,
  StatusList2021Entry,
  StatusList2021Credential,
  StatusList2021Context,
} from '@ew-did-registry/credentials-interface';

export const credentialStatus: StatusList2021Entry = {
  id: 'string',
  type: CredentialStatusType.StatusList2021,
  statusPurpose: CredentialStatusPurpose.REVOCATION,
  statusListIndex: '0',
  statusListCredential:
    'https://isc.energyweb.org/api/v1/status-list/700e7ad4-5309-421c-bcf9-43acfa89c0e4',
};

export const statusListWithRevokedStatus: StatusList2021Credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    StatusList2021Context,
  ],
  id: 'http://isc.energyweb.org/api/v1/status-list/700e7ad4-5309-421c-bcf9-43acfa89c0e4',
  type: ['VerifiableCredential', 'StatusList2021Credential'],
  credentialSubject: {
    id: 'urn:uuid:db72c30a-404c-4104-b787-a4c244035c61',
    encodedList: 'H4sIAAAAAAAAA2MEABvfBaUBAAAA',
    statusPurpose: CredentialStatusPurpose.REVOCATION,
    type: CredentialStatusType.StatusList2021,
  },
  issuer: 'did:ethr:0x0539:0x3b6a8f4d58ac7f8be5e3497a1ba913901cb9d87a',
  issuanceDate: '2022-05-30T14:32:24.069Z',
  proof: {
    '@context': 'https://w3id.org/security/suites/eip712sig-2021/v1',
    type: 'EthereumEip712Signature2021',
    proofPurpose: 'assertionMethod',
    proofValue:
      '0x491a96c82385ae96fefbfda10c9de5f747846c107b7e0047a5960affb293fc22785749afc776bfc7ccdec11fc91c37b7c4739085418cf5efe3047b3533ca81321c',
    verificationMethod:
      'did:ethr:0x0539:0x3b6a8f4d58ac7f8be5e3497a1ba913901cb9d87a#controller',
    created: '2022-06-06T16:11:14.852Z',
    eip712Domain: {
      domain: {},
      messageSchema: {
        CredentialSubject: [
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'statusPurpose', type: 'string' },
          { name: 'encodedList', type: 'string' },
        ],
        EIP712Domain: [],
        Proof: [
          { name: '@context', type: 'string' },
          { name: 'verificationMethod', type: 'string' },
          { name: 'created', type: 'string' },
          { name: 'proofPurpose', type: 'string' },
          { name: 'type', type: 'string' },
        ],
        VerifiableCredential: [
          { name: '@context', type: 'string[]' },
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string[]' },
          { name: 'issuer', type: 'string' },
          { name: 'issuanceDate', type: 'string' },
          { name: 'credentialSubject', type: 'CredentialSubject' },
          { name: 'proof', type: 'Proof' },
        ],
      },
      primaryType: 'VerifiableCredential',
    },
  },
};

export const statusListWithNonRevokedStatus = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/vc/status-list/2021/v1',
  ],
  id: 'https://identitycache.org/v1/status-list/urn:uuid:950aaccd-9ada-498f-92cf-ff9f73c355ac',
  type: ['VerifiableCredential', 'StatusList2021Credential'],
  credentialSubject: {
    id: 'https://identitycache.org/v1/status-list/urn:uuid:950aaccd-9ada-498f-92cf-ff9f73c355ac',
    type: 'StatusList2021',
    statusPurpose: 'revocation',
    encodedList: 'H4sIAAAAAAAAA2MAAI3vAtIBAAAA',
  },
  issuer: 'did:ethr:0x539:0x8b5f9e9398aabe24c549795a8b148cdf15b9dbce',
  issuanceDate: '2022-06-21T06:58:40.145Z',
  proof: {
    '@context': 'https://w3id.org/security/suites/eip712sig-2021/v1',
    type: 'EthereumEip712Signature2021',
    proofPurpose: 'assertionMethod',
    proofValue:
      '0x3468f1b1e9b3d6a92c8dcfa20620f9c493fc226246debb740183a0ddf80e0a0615588ce4baca19ddb178483e8b09d43581db07e1979f6e379fa20e0e1eccb0921b',
    verificationMethod:
      'did:ethr:0x539:0x8b5f9e9398aabe24c549795a8b148cdf15b9dbce#controller',
    created: '2022-06-21T06:58:40.145Z',
    eip712Domain: {
      domain: {},
      messageSchema: {
        EIP712Domain: [],
        Proof: [
          { name: '@context', type: 'string' },
          { name: 'verificationMethod', type: 'string' },
          { name: 'created', type: 'string' },
          { name: 'proofPurpose', type: 'string' },
          { name: 'type', type: 'string' },
        ],
        StatusList2021: [
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'statusPurpose', type: 'string' },
          { name: 'encodedList', type: 'string' },
        ],
        VerifiableCredential: [
          { name: '@context', type: 'string[]' },
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string[]' },
          { name: 'issuer', type: 'string' },
          { name: 'issuanceDate', type: 'string' },
          { name: 'credentialSubject', type: 'StatusList2021' },
          { name: 'proof', type: 'Proof' },
        ],
      },
      primaryType: 'VerifiableCredential',
    },
  },
};
