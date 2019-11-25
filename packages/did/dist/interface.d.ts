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
    set(did: string): void;
    /**
     * Sets a DID for the provided network
     * @param {string} network
     * @param {string} id
     * @returns {void}
     */
    set(network: string, id: string): void;
    /**
     * Gets a DID for a particular network
     * @param {string} did
     * @returns {string | undefined}
     */
    get(network: string): string | undefined;
}
