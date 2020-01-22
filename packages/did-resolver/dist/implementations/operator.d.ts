import { IKeys } from '@ew-did-registry/keys';
import { IOperator } from '../interface';
import { DIDAttribute, IUpdateData, PubKeyType, IResolverSettings } from '../models';
import Resolver from './resolver';
export declare class Operator extends Resolver implements IOperator {
    /**
     * ERC-1056 compliant ethereum smart-contract
     */
    private _didRegistry;
    private readonly _keys;
    private readonly _wallet;
    /**
     * Ethereum blockchain provider
     */
    private readonly _provider;
    /**
     *
     * @param { IKeys } keys - identifies an account which acts as a
     * controller in a subsequent operations with DID document
     */
    constructor(keys: IKeys, settings?: IResolverSettings);
    /**
     * Empty for this implementation
     *
     * @param did
     * @param context
     * @returns Promise<boolean>
     */
    create(): Promise<boolean>;
    /**
     * Sets attribute value in DID document identified by the did
     *
     * @example
     *```typescript
     * import {
     * Operator, DIDAttribute, Algorithms, PubKeyType, Encoding
     *  } from '@ew-did-registry/did-resolver';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const ownerKeys = new Keys();
     * const operator = new Operator(ownerKeys);
     * const pKey = DIDAttribute.PublicKey;
     * const updateData = {
     *     algo: Algorithms.ED25519,
     *     type: PubKeyType.VerificationKey2018,
     *     encoding: Encoding.HEX,
     *     value: new Keys().publicKey,
     * };
     * const validity = 10 * 60 * 1000;
     * const updated = await operator.update(did, pKey, updateData, validity);
     * ```
     *
     * @param { string } did - did associated with DID document
     * @param { DIDAttribute } didAttribute - specifies updated section in DID document. Must be 31
     * bytes or shorter
     * @param { IUpdateData } updateData
     * @param { number } validity - time in milliseconds during which
     *                              attribute will be valid
     * @returns Promise<boolean>
     */
    update(did: string, didAttribute: DIDAttribute, updateData: IUpdateData, validity?: number): Promise<boolean>;
    /**
     * Revokes the delegate from DID Document
     * Returns true on success
     *
     * @param { string } identityDID - did of identity of interest
     * @param { PubKeyType } delegateType - type of delegate of interest
     * @param { string } delegateDID - did of delegate of interest
     * @returns Promise<boolean>
     */
    revokeDelegate(identityDID: string, delegateType: PubKeyType, delegateDID: string): Promise<boolean>;
    /**
     * Revokes the attribute from DID Document
     * Returns true on success
     *
     * @param { string } identityDID - did of identity of interest
     * @param { DIDAttribute } attributeType - type of attribute to revoke
     * @param { IUpdateData } updateData - data required to identify the correct attribute to revoke
     * @returns Promise<boolean>
     */
    revokeAttribute(identityDID: string, attributeType: DIDAttribute, updateData: IUpdateData): Promise<boolean>;
    /**
     * Changes the owner of particular decentralised identity
     * Returns true on success
     *
     * @param { string } identityDID - did of current identity owner
     * @param { string } newOwnerDid - did of new owner that will be set on success
     * @returns Promise<boolean>
     */
    changeOwner(identityDID: string, newOwnerDid: string): Promise<boolean>;
    /**
     * Revokes authentication methods, public keys and delegates from DID document
     *
     * @example
     * ```typescript
     *import { Operator } from '@ew-did-registry/did-resolver';
     *import { Keys } from '@ew-did-registry/keys';
     *
     * const ownerKeys = new Keys();
     * const operator = new Operator(ownerKeys);
     * const updated = await operator.deactivate(did);
     * ```
     *
     * @param { string } did
     * @returns Promise<boolean>
     */
    deactivate(did: string): Promise<boolean>;
    private _revokeAuthentications;
    private _revokePublicKeys;
    private _revokeServices;
    private _sendTransaction;
    private _composeAttributeName;
    private _hexify;
    private _getProvider;
    private static _parseDid;
}
