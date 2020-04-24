import { IDID, Methods } from '@ew-did-registry/did';
import { IDIDDocumentFull, IDIDDocumentLite } from '@ew-did-registry/did-document';
import { IClaimsFactory } from '@ew-did-registry/claims';
import { IOperator } from '@ew-did-registry/did-resolver-interface';
import { IKeys } from '@ew-did-registry/keys';

/**
 * @interface {IDIDRegistry}
 * Serves as a single entry point for all identity functionality
 */
export interface IDIDRegistry {
  /**
   * IDID specifies the interface for decentralised identities
   */
  did: IDID;
  /**
   * IDIDDocument exposes methods to operate with DID Documents
   */
  document: IDIDDocumentFull;
  /**
   * IClaims exposes functionality needed to manage Private and Public claims
   */
  claims: IClaimsFactory;
  /**
   * IKeys is responsible for key management, signing, as well as verification of signature
   */
  keys: Map<Methods | string, IKeys>;

  changeOperator(operator: IOperator, network: Methods | string): void;

  read(did: string): Promise<IDIDDocumentLite>;
}
