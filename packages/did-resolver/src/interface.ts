import { BigNumber } from 'ethers/utils';
import { IDIDDocument, DIDAttribute, IUpdateData } from './models';

export interface IResolver {
    /**
     * Constructor takes keys and resolver settings to create a new Resolver
     * constructor(settings?: IResolverSettings);
     *
     * Private members:
     *   settings;
     */
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
     * @param {string} did
     * @returns {IDIDDocument}
     */
    read(did: string): Promise<IDIDDocument>;
}

export interface IOperator extends IResolver {
  /**
   * Registers a DID-Document for a given DID, and defines the provided context
   * @param {string} did
   * @param {string} context
   * @returns {boolean}
   */
  create(did: string, context: string): Promise<boolean>;

  /**
   * Updates relevant attribute of the DID Document
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
    validity: number|BigNumber
  ): Promise<boolean>;

  /**
   * Attempts to deactivate the DID Document for a given DID.
   * Successful, if the transaction is accepted by the smart contract.
   * Deactivation should be done by the owner of DID
   * @param {string} did
   * @returns {boolean}
   */
  deactivate(did: string): Promise<boolean>;
}
