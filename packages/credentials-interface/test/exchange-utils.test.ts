import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import {
  VpRequest,
  VpRequestInteractServiceType,
  VpRequestQueryType,
} from '../src/exchange.types';
import {
  isContinueExchangeCredentials,
  isContinueExchangeSelections,
  isPresentationDefinition,
  isPresentationDefinitionV1,
  isPresentationDefinitionV2,
  isVpRequest,
} from '../src/exchange.utils';

use(sinonChai);

describe('[CREDENTIALS INTERFACE PACKAGE] Exchange utils', () => {
  const vpRequest: VpRequest = {
    query: [
      {
        type: VpRequestQueryType.presentationDefinition,
        credentialQuery: [
          {
            presentationDefinition: {
              id: '286bc1e0-f1bd-488a-a873-8d71be3c690e',
              input_descriptors: [
                {
                  id: '<DESCRIPTOR ID>',
                  name: 'Descriptor name',
                  purpose: 'Descriptor purpose',
                  constraints: {
                    fields: [
                      {
                        path: ['$.credentialSubject.role.namespace'],
                        filter: {
                          type: 'string',
                          const: 'role.iam.ewc',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    ],
    interact: {
      service: [
        {
          serviceEndpoint: 'https://example.com/vp-request-service',
          type: VpRequestInteractServiceType.unmediatedPresentation,
        },
      ],
    },
    challenge: 'challenge',
  };

  it('should check valid continue exchange credentials request', () => {
    const credential = {
      vpRequest,
      credentials: [
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
    const valid = isContinueExchangeCredentials(credential);
    expect(valid).to.be.true;
  });

  it('should result with false for invalid continue exchange credentials request', () => {
    const credential = {
      vpRequest: { ...vpRequest, interact: undefined },
      credentials: [],
    };
    const valid = isContinueExchangeCredentials(credential);
    expect(valid).to.be.false;
  });

  it('should check valid continue exchange selections request', () => {
    const credential = {
      vpRequest,
      selections: [
        {
          presentationDefinition:
            vpRequest.query[0].credentialQuery[0].presentationDefinition,
          selectResults: {
            errors: [],
            matches: [
              {
                name: 'Energy Supplier Customer Contract',
                rule: 'all',
                vc_path: ['$.verifiableCredential[0]'],
              },
            ],
            areRequiredCredentialsPresent: 'info',
            verifiableCredential: [
              {
                id: 'urn:uuid:88dbacbe-97b1-4a9d-9eff-0a72ca9d85a5',
                type: ['VerifiableCredential', 'EWFRole'],
                proof: {
                  type: 'EthereumEip712Signature2021',
                  created: '2022-06-01T09:13:21.022Z',
                  '@context':
                    'https://w3id.org/security/suites/eip712sig-2021/v1',
                  proofValue:
                    '0xd3d66b7b310f6da0813cf5c6c9a1b59b160fe06f81701b337ce17a63b931a2cf30c67d7b4f902f19d3e75f1e3a48af5accd593c09ec6df5b2f5c289a348b4e581b',
                  eip712Domain: {
                    domain: {},
                    primaryType: 'VerifiableCredential',
                    messageSchema: {
                      Proof: [
                        { name: '@context', type: 'string' },
                        { name: 'verificationMethod', type: 'string' },
                        { name: 'created', type: 'string' },
                        { name: 'proofPurpose', type: 'string' },
                        { name: 'type', type: 'string' },
                      ],
                      EWFRole: [
                        { name: 'namespace', type: 'string' },
                        { name: 'version', type: 'string' },
                      ],
                      EIP712Domain: [],
                      IssuerFields: [
                        { name: 'key', type: 'string' },
                        { name: 'value', type: 'string' },
                      ],
                      CredentialSubject: [
                        { name: 'id', type: 'string' },
                        { name: 'role', type: 'EWFRole' },
                        { name: 'issuerFields', type: 'IssuerFields[]' },
                      ],
                      VerifiableCredential: [
                        { name: '@context', type: 'string[]' },
                        { name: 'id', type: 'string' },
                        { name: 'type', type: 'string[]' },
                        { name: 'issuer', type: 'string' },
                        { name: 'issuanceDate', type: 'string' },
                        {
                          name: 'credentialSubject',
                          type: 'CredentialSubject',
                        },
                        { name: 'proof', type: 'Proof' },
                      ],
                    },
                  },
                  proofPurpose: 'assertionMethod',
                  verificationMethod:
                    'did:ethr:0x012047:0x2670a5f431f0b444329db18b3bd07ccfe6bf4cf3#controller',
                },
                issuer:
                  'did:ethr:0x012047:0x2670a5f431f0b444329db18b3bd07ccfe6bf4cf3',
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                issuanceDate: '2022-06-01T09:13:21.018Z',
                credentialSubject: {
                  id: 'did:ethr:volta:0x06Bdb40FE8bD203aD7Af211ba1fF67f83F09A6D1',
                  role: {
                    version: '1',
                    namespace: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
                  },
                  issuerFields: [{ key: 'iscustomer', value: 'true' }],
                },
              },
            ],
            warnings: [],
          },
        },
      ],
    };
    const valid = isContinueExchangeSelections(credential);
    expect(valid).to.be.true;
  });

  it('should result with false for invalid continue exchange selections request', () => {
    const credential = {
      vpRequest: { ...vpRequest, interact: undefined },
      selections: [{ vpRequest }],
    };
    const valid = isContinueExchangeSelections(credential);
    expect(valid).to.be.false;
  });

  it('should check valid presentation definition v1', () => {
    const valid = isPresentationDefinitionV1(
      vpRequest.query[0].credentialQuery[0].presentationDefinition
    );
    expect(valid).to.be.true;
  });

  it('should check valid presentation definition v2', () => {
    const valid = isPresentationDefinitionV2(
      vpRequest.query[0].credentialQuery[0].presentationDefinition
    );
    expect(valid).to.be.true;
  });

  it('should check valid presentation definition', () => {
    const valid = isPresentationDefinition(
      vpRequest.query[0].credentialQuery[0].presentationDefinition
    );
    expect(valid).to.be.true;
  });

  it('should check valid vp request', () => {
    const valid = isVpRequest(vpRequest);
    expect(valid).to.be.true;
  });
});
