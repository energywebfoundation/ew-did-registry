import { BigNumber } from 'ethers/utils';
import {
    IDIDDocument, DIDAttribute, IUpdateData, DelegateTypes, IResolverSettings,
} from './models';

export interface IResolver {
    readonly settings: IResolverSettings;
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
}

export interface IOperator extends IResolver {
  /**
   * Registers a DID-Document for a given DID, and defines the provided context.
   *
   * @param {string} did
   * @param {string} context
   * @returns {boolean}
   */
  create(): Promise<boolean>;

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
    validity: number|BigNumber
  ): Promise<boolean>;

  /**
   * Attempts to deactivate the DID Document for a given DID.
   * Successful, if the transaction is accepted by the smart contract.
   * Deactivation should be done by the owner of DID.
   *
   * @param {string} did
   * @returns {boolean}
   */
  deactivate(did: string): Promise<boolean>;
}
