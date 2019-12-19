import { IResolver, IOperator } from './interface';
import { IDIDDocument, IResolverSettings } from './models';
declare class Resolver implements IResolver {
    private readonly _settings;
    /**
     * Constructor
     *
     * Settings have to be passed to construct resolver
     * @param {IResolverSettings} settings
     */
    constructor(settings?: IResolverSettings);
    read(did: string): Promise<IDIDDocument>;
}
export { IResolver, IOperator, IDIDDocument, Resolver, };
