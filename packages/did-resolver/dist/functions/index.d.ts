import { IDIDDocument, IDIDLogData, IResolverSettings } from '../models';
export declare const fetchDataFromEvents: (did: string, document: IDIDLogData, resolverSettings: IResolverSettings) => Promise<void>;
export declare const wrapDidDocument: (did: string, document: IDIDLogData, context?: string) => IDIDDocument;
