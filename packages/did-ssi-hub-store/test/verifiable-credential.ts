export const credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/vc/status-list/2021/v1',
  ],
  id: 'urn:uuid:e463c294-17bd-42d1-817a-0248bfa149f3',
  type: ['VerifiableCredential', 'EWFRole'],
  credentialSubject: {
    id: 'did:ethr:0x0539:0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2',
    issuerFields: [],
    role: { namespace: 'admin', version: '1' },
  },
  issuer: 'did:ethr:0x539:0x0d1d4e623d10f9fba5db95830f7d3839406c6af2',
  issuanceDate: '2022-06-24T11:28:28.103Z',
  proof: {
    '@context': 'https://w3id.org/security/suites/eip712sig-2021/v1',
    type: 'EthereumEip712Signature2021',
    proofPurpose: 'assertionMethod',
    proofValue:
      '0xd4274533512a8715247fcfd854458bf427bcfb285672383730225b811c9428db015b8e98f46eb40c53e798c0914333ae1aa3b947ae60e6e60cc09bcb469f22e31c',
    verificationMethod:
      'did:ethr:0x539:0x0d1d4e623d10f9fba5db95830f7d3839406c6af2#controller',
    created: '2022-06-24T11:28:28.105Z',
    eip712Domain: {
      domain: {},
      messageSchema: {
        CredentialSubject: [
          { name: 'id', type: 'string' },
          { name: 'role', type: 'EWFRole' },
          { name: 'issuerFields', type: 'IssuerFields[]' },
        ],
        EIP712Domain: [],
        EWFRole: [
          { name: 'namespace', type: 'string' },
          { name: 'version', type: 'string' },
        ],
        IssuerFields: [
          { name: 'key', type: 'string' },
          { name: 'value', type: 'string' },
        ],
        Proof: [
          { name: '@context', type: 'string' },
          { name: 'verificationMethod', type: 'string' },
          { name: 'created', type: 'string' },
          { name: 'proofPurpose', type: 'string' },
          { name: 'type', type: 'string' },
        ],
        StatusList2021Entry: [
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'statusPurpose', type: 'string' },
          { name: 'statusListIndex', type: 'string' },
          { name: 'statusListCredential', type: 'string' },
        ],
        VerifiableCredential: [
          { name: '@context', type: 'string[]' },
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string[]' },
          { name: 'issuer', type: 'string' },
          { name: 'issuanceDate', type: 'string' },
          { name: 'credentialSubject', type: 'CredentialSubject' },
          { name: 'proof', type: 'Proof' },
          { name: 'credentialStatus', type: 'StatusList2021Entry' },
        ],
      },
      primaryType: 'VerifiableCredential',
    },
  },
  credentialStatus: {
    id: 'https://credential-status/admin',
    type: 'Entry2021',
    statusPurpose: 'REVOCATION',
    statusListCredential:
      'https://isc.energyweb.org/api/v1/status-list/700e7ad4-5309-421c-bcf9-43acfa89c0e4',
    statusListIndex: '0',
  },
};
