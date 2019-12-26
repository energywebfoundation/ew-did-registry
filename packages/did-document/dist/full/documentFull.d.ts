import { DIDAttribute, IOperator, IUpdateData } from '@ew-did-registry/did-resolver';
import { BigNumber } from 'ethers/utils';
import { IDIDDocumentFull } from './interface';
import { DIDDocumentLite } from '../lite';
declare class DIDDocumentFull extends DIDDocumentLite implements IDIDDocumentFull {
    private _operator;
    constructor(did: string, operator: IOperator);
    create(context?: string): Promise<boolean>;
    deactivate(): Promise<boolean>;
    update(attribute: DIDAttribute, data: IUpdateData, validity: number | BigNumber): Promise<boolean>;
}
export default DIDDocumentFull;
