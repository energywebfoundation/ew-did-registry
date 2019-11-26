import { Networks } from './models';

export interface IDID {
    /**
     * private members:
     * dids: IDidStore;
     */

    /**
     * Sets a DID for a particular network (inferred from DID provided)
     * @param {string} did
     * @returns {void}
     */
    set(did: string): void;

    /**
     * Sets a DID for the provided network
     * @param {Networks} network
     * @param {string} id
     * @returns {void}
     */
    set(network: Networks, id: string): void;

    /**
     * Gets a DID for a particular network
     * @param {Networks} network
     * @returns {string | undefined}
     */

    get(network: Networks): string | undefined;
}
