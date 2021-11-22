export const didPattern = `^did:[a-z0-9]+?:?[a-z0-9]+?:(0x[A-Fa-f0-9]{40})$`;

/**
* Checks if did is valid and returns the did method
*
* @param did
* @private
*/
export function getDIDMethod(did : string): string {
    const match = did.match(didPattern);
    if (!match) {
        throw new Error('Invalid DID');
    }
    const [, method, ...param] = did.split(':');
    return method;
}

/**
* Checks if did is valid and returns the chain did is associated with it
*
* @param did
* @private
*/
export function getDIDChain(did : string) : string {
    const match = did.match(didPattern);
    if (!match) {
        throw new Error('Invalid DID');
    }
    if (did.split(':').length > 3 ) {
        const [, , chain, ...param] = did.split(':');
        return chain;
    }
    return "No chain info";
}