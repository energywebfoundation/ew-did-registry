import { IResolver } from '../interface';
import { IDIDDocument, IResolverSettings } from './index';
declare class Resolver implements IResolver {
    protected readonly _settings: IResolverSettings;
    /**
     * Constructor
     *
     * Settings have to be passed to construct resolver
     * @param {IResolverSettings} settings
     */
    constructor(settings?: IResolverSettings);
    read(did: string): Promise<IDIDDocument>;
}
export default Resolver;
