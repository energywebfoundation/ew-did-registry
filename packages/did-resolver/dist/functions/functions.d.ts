import { Contract, ethers } from 'ethers';
import { IDIDDocument, IDIDLogData, IResolverSettings } from '../models';
export declare const fetchDataFromEvents: (did: string, document: IDIDLogData, resolverSettings: IResolverSettings, contract: Contract, provider: ethers.providers.BaseProvider) => Promise<void>;
export declare const wrapDidDocument: (did: string, document: IDIDLogData, context?: string) => IDIDDocument;
