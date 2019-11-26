import { IDID } from '../../did/src';
import { IDIDDocumentLite } from './lite';
import { IDIDDocumentFull } from './full';
import { IResolver } from '@ew-did-registry/resolver';
/**
 * This interface is a factory of Lite and Full DID Documents
 */
export interface IDIDDocument {
    /**
     * Constructor takes DID of the subject of interest
     * constructor(did:IDID);
     *
     * Private member:
     * did;
     */
    /**
     * Provided with the DID and Resolver, lite version of DID Document is returned
     * @param {IDID} did
     * @param {IResolver} resolver
     * @returns {IDIDDocumentLite}
     */
    createLite(did: IDID, resolver: IResolver): IDIDDocumentLite;
    /**
     * Provided with the DID and Resolver, full version of DID Document is returned
     * @param {IDID} did
     * @param {IResolver} resolver
     * @returns {IDIDDocumentFull}
     */
    createFull(did: IDID, resolver: IResolver): IDIDDocumentFull;
}
