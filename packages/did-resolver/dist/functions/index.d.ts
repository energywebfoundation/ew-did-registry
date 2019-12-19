import { IDIDDocument, IDIDLogData, IResolverSettings } from '../models';
export declare const fetchDataFromEvents: (etherAddress: string, document: IDIDLogData, resolverSettings: IResolverSettings) => Promise<void>;
export declare const wrapDidDocument: (address: string, document: IDIDLogData, context?: string) => IDIDDocument;
