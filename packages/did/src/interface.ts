import { Networks } from './models';

export interface IDID {
    /**
     * private members:
     * dids: IDidStore;
     */

    /**
     * Sets a DID for a particular network (inferred from DID)
     * @param {string} did
     * @returns {void}
     */
    setDid(did: string): void;

    /**
     * Sets a DID for the provided network
     * @param {string} network
     * @param {string} id
     * @returns {void}
     */
    set(network: Networks, id: string): void;

    /**
     * Gets a DID for a particular network
     * @param {string} did
     * @returns {string | undefined}
     */
    get(network: Networks): string | undefined;
}
