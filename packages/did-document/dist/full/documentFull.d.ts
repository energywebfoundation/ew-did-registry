import { DIDAttribute, IOperator, IUpdateData } from '@ew-did-registry/did-resolver';
import { IDIDDocumentFull } from './interface';
import { DIDDocumentLite } from '../lite';
declare class DIDDocumentFull extends DIDDocumentLite implements IDIDDocumentFull {
    private _operator;
    constructor(did: string, operator: IOperator);
    /**
     * Creates new empty DID document
     *
     * @example
     * ```typescript
     *  import { DIDDocumentFull } from '@ew-did-registry/did-document';
     *
     *  const document = new DIDDocumentFull(did, operator);
     *  await document.create();
     * ```
     * @return { boolean }
     */
    create(): Promise<boolean>;
    /**
     * Deactivates DID document
     *
     * @example
     * ```typescript
     * import { DIDDocumentFull } from '@ew-did-registry/did-document';
     *
     * const document = new DIDDocumentFull(did, operator);
     * await document.create();
     * await document.update(didAttribute, updateData, validity);
     * await document.deactivate();
     * ```
     * @return { boolean }
     */
    deactivate(): Promise<boolean>;
    /**
     * Updates attribute on the DID document
     *
     * @example
     * ```typescript
     * import { DIDDocumentFull } from '@ew-did-registry/did-document';
     * import { DIDAttribute, Algorithms, PubKeyTypes } from '@ew-did-registry/did-document';
     *
     * const document = new DIDDocumentFull(did, operator);
     * await document.create();
     * const didAttribute = DIDAttribute.PublicKey;
     * const validity = 5 * 60 * 1000;
     * await document.update(
     *  DIDAttribute.PublicKey,
     *  {
     *    type: PubKeyType.VerificationKey2018,
     *    algo: Algorithms.ED25519,
     *    encoding: Encoding.HEX,
     *    value: new Keys().publicKey,
     *  },
     *  validity,
     *  );
     * ```
     * @param { DIDAttribute } attribute
     * @param { IUpdateData } data
     * @param { number } validity - time in milliseconds during the attribujte will be valid
     * @return { boolean }
     */
    update(attribute: DIDAttribute, data: IUpdateData, validity: number): Promise<boolean>;
}
export default DIDDocumentFull;
