import { IPresentationDefinition, SelectResults } from '@sphereon/pex';
import { CredentialSubject, VerifiableCredential } from './credentials.types';
import { VerifiablePresentation } from './presentation.types';

export type ExchangeInvitation = {
  type: string;
  /**
   * unique SSI session
   */
  url: string;
};

export const VC_API_EXCHANGE =
  'https://energyweb.org/out-of-band-invitation/vc-api-exchange';

export type VpRequest = {
  /**
   * From https://w3c-ccg.github.io/vp-request-spec/#format :
   * "Challenge that will be digitally signed in the authentication proof
   *  that will be attached to the VerifiablePresentation response"
   */
  challenge: string;

  query: VpRequestQuery[];

  /**
   * The schema for this property is taken from https://github.com/w3c-ccg/vc-api/issues/245
   */
  interact: { service: VpRequestInteractService[] };
};

/**
 * From https://w3c-ccg.github.io/vp-request-spec/#format :
 * "To make a request for one or more objects wrapped in a Verifiable Presentation,
 *  a client constructs a JSON request describing one or more queries that it wishes to perform from the receiver."
 * "The query type serves as the main extension point mechanism for requests for data in the presentation.
 *  This document defines several common query types."
 */
export type VpRequestQuery = {
  type: VpRequestQueryType;
  credentialQuery: Array<
    VpRequestPresentationDefinitionQuery | VpRequestDidAuthQuery
  >;
};

export type VpRequestPresentationDefinitionQuery = {
  presentationDefinition: IPresentationDefinition;
};

export type VpRequestDidAuthQuery = Record<string, unknown>;

export type VpRequestInteractService = {
  type: VpRequestInteractServiceType;
  serviceEndpoint: string;
};

/**
 * These should be the interact service types that are both
 * - supported by the wallet app
 * - listed in the VP Request spec https://w3c-ccg.github.io/vp-request-spec/#interaction-types
 */
export enum VpRequestInteractServiceType {
  /**
   * https://w3c-ccg.github.io/vp-request-spec/#unmediated-presentation
   */
  unmediatedPresentation = 'UnmediatedHttpPresentationService2021',

  /**
   * https://w3c-ccg.github.io/vp-request-spec/#mediated-presentation
   */
  mediatedPresentation = 'MediatedHttpPresentationService2021',
}

export enum VpRequestQueryType {
  /**
   * https://w3c-ccg.github.io/vp-request-spec/#did-authentication-request
   */
  didAuth = 'DIDAuth',

  /**
   * A presentation definition https://identity.foundation/presentation-exchange/#presentation-definition
   */
  presentationDefinition = 'PresentationDefinition',
}

/**
 * A definition of an interact service to be used in an exchange
 */
export type VpRequestInteractServiceDefinition = {
  type: VpRequestInteractServiceType;
};

/**
 * Set of credentials to choose from to meet exchange query
 */
export type ContinueExchangeSelections = {
  vpRequest: VpRequest;
  selections: {
    presentationDefinition: IPresentationDefinition;
    selectResults: SelectResults;
  }[];
};

/**
 * Credentials presented to continue exchange
 */
export type ContinueExchangeCredentials<T extends CredentialSubject> = {
  vpRequest: VpRequest;
  credentials: VerifiableCredential<T>[];
};

/**
 * Describes the possible contents of response to a start/continue exchange request
 */
export type ExchangeResponse = {
  errors: string[];
  /**
   * Verifiable Presentation Request.
   * Should conform to VP-Request specification.
   * Will be returned if a VP is required to obtain more information from requester
   * May not be returned if no further information is required (for example, at the end of the workflow)
   */
  vpRequest?: VpRequest;
  /**
   * If it is an issuance response, then a vp may be provided
   */
  vp?: VerifiablePresentation;
};
