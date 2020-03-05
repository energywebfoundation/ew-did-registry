import { Contract, ethers } from 'ethers';
import { IDIDDocument, IDIDLogData, IResolverSettings, IPublicKey, IServiceEndpoint, IAuthentication } from '../models';
/**
 * A high level function that manages the flow to read data from the blockchain
 *
 * @param did
 * @param document
 * @param resolverSettings
 * @param contract
 * @param provider
 */
export declare const fetchDataFromEvents: (did: string, document: IDIDLogData, resolverSettings: IResolverSettings, contract: Contract, provider: ethers.providers.BaseProvider, filter?: {
    [key: string]: {
        [key: string]: string;
    };
}) => Promise<IPublicKey | IAuthentication | IServiceEndpoint>;
/**
 * Provided with the fetched data, the function parses it and returns the
 * DID Document associated with the relevant user
 *
 * @param did
 * @param document
 * @param context
 */
export declare const wrapDidDocument: (did: string, document: IDIDLogData, context?: string) => IDIDDocument;
