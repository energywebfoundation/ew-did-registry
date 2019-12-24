import { IUpdateData } from '@ew-did-registry/did-resolver';
import { IDIDDocumentLite } from '../lite';

/**
 * Interface describes the full version of DID Document with CRUD functionality
 * This interface extends lite DID Document interface
 */
export interface IDIDDocumentFull extends IDIDDocumentLite{

    /**
     * New DID Document is registered on the Blockchain with the provided context,
     * if no Document existed for the specified DID
     * @param {string} context
     * @returns {boolean}
     */
    create(context: string): boolean;

    /**
     * Provided with necessary parameters, method updates relevant attributes of the DID Document
     * @param {string} attribute
     * @param {IUpdateParameters} data
     * @returns {boolean}
     */
    update(attribute: string, data: IUpdateData): boolean;

    /**
     * On success the status of the DID Document is changed from “active” to “deactivated”.
     * @returns {boolean}
     */
    deactivate(): boolean;
}
