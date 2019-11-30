import { IResolver, IOperator } from '@ew-did-registry/resolver';
import { IDIDDocumentLite } from './lite';
import { IDIDDocumentFull } from './full';

/**
 * This interface is a factory of Lite and Full DID Documents
 */
export interface IDIDDocument {

    /**
     * Constructor takes DID of the subject of interest
     * constructor(did:string);
     *
     * Private member:
     * did;
     */

    /**
     * Provided with the DID and Resolver, lite version of DID Document is returned
     * @param {string} did
     * @param {IResolver} resolver
     * @returns {IDIDDocumentLite}
     */
    createLite(did: string, resolver: IResolver): IDIDDocumentLite;

    /**
     * Provided with the DID and Resolver, full version of DID Document is returned
     * @param {string} did
     * @param {IOperator} operator
     * @returns {IDIDDocumentFull}
     */
    createFull(did: string, operator: IOperator): IDIDDocumentFull;
}
