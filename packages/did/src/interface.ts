import {Methods} from './models';

export interface IDID {
    /**
     * private members:
     * dids: IDidStore;
     */

    /**
     * Sets a DID for a particular method (inferred from DID provided)
     * @param {string} did
     * @returns {void}
     */
    set(did: string): IDID;

    /**
     * Sets a DID for the provided method
     * @param {Methods} method
     * @param {string} id
     * @returns {void}
     */
    set(method: string, id: string): IDID;

    /**
     * Sets a DID for the provided method and chain name
     * @param {Methods} method
     * @param {string} chain
     * @param {string} id
     * @returns {void}
     */
     set(method: string, chain: string, id: string): IDID;

    /**
     * Gets a DID for a particular method
     * @param {Methods} method
     * @returns {string | undefined}
     */
    get(method: string): string | undefined;
}
