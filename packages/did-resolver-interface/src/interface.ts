import { BigNumber } from 'ethers';
import {
  IDIDDocument,
  DIDAttribute,
  IUpdateData,
  DelegateTypes,
  IVerificationMethod,
  IServiceEndpoint,
  IAuthentication,
  VerificationMethodType,
  DocumentSelector,
  IDIDLogData,
} from './models';

export interface IResolver {
  /**
   * Constructor takes keys and resolver settings to create a new Resolver
   * constructor(settings?: IResolverSettings);
   *
   * Private members:
   *   settings;
   */

  /**
   * Read method resolves the DID Document for the provided DID.
   * Should not be confused with “read” method in DID Document Lite,
   * which returns the required attribute from the DID Document.
   *
   * @param {string} did
   * @returns {Promise<IDIDDocument>}
   */
  read(did: string): Promise<IDIDDocument>;

  /**
   * Returns the current owner for certain DID.
   * If DID document has not been created, did will be identical to address.
   * After creation DID owner can be changed.
   *
   * @param {string} did
   * @returns {Promise<string>}
   */
  identityOwner(did: string): Promise<string>;

  /**
   * Checks if the delegate is present for a particular DID.
   * Returns boolean.
   *
   * @param {string} identityDID
   * @param {DelegateTypes} delegateType
   * @param {string} delegateDID
   * @returns {Promise<boolean>}
   */
  validDelegate(
    identityDID: string,
    delegateType: DelegateTypes,
    delegateDID: string
  ): Promise<boolean>;

  readAttribute(
    did: string,
    selector: DocumentSelector,
  ): Promise<IVerificationMethod | IServiceEndpoint | IAuthentication | undefined>;

  /**
   * Reads events starting from specified block
   *
   * @param block {number} - block to start reading from
   *
   * @returns - part of document along with last read block
   */
  readFromBlock(did: string,
    topBlock: BigNumber,
  ): Promise<IDIDLogData>;

  lastBlock(did: string): Promise<BigNumber>;
}

export interface IOperator extends IResolver {
  /**
   * Registers a DID-Document for a given DID, and defines the provided context.
   *
   * @param {string} did
   * @param {string} context
   * @returns {boolean}
   */
  create(did: string): Promise<boolean>;

  /**
   * Updates relevant attribute of the DID Document.
   *
   * @param {string} did
   * @param { DIDAttribute } attribute
   * @param { IUpdateData } value
   * @param { number } validity
   * @returns {boolean}
   */
  update(
    did: string,
    attribute: DIDAttribute,
    value: IUpdateData,
    validity?: number | BigNumber
  ): Promise<BigNumber>;

  /**
   * Attempts to deactivate the DID Document for a given DID.
   * Successful, if the transaction is accepted by the smart contract.
   * Deactivation should be done by the owner of DID.
   *
   * @param {string} did
   * @returns {boolean}
   */
  deactivate(did: string): Promise<void>;

  revokeDelegate(did: string, delegateType: VerificationMethodType, delegateDID: string): Promise<boolean>;

  revokeAttribute(
    did: string,
    attributeType: DIDAttribute,
    updateData: IUpdateData
  ): Promise<boolean>;
}

export interface IClaimsVerifier {
  verifyPublishedClaim(token: string, signer: string): Promise<boolean>;
  verifyPublicClaim(token: string, verifyData: object): Promise<boolean>;
}

export interface IClaimsIssuer extends IClaimsVerifier{
  createPublicClaim(publicData: object, did: string): Promise<string>;
  PublishPublicClaim(issued: string, verifyData: object, opts: { hashAlg: string; createHash: (data: string) => string }): Promise<string>;
}
