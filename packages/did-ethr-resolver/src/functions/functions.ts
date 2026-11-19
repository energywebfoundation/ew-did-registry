import { ethers, providers, utils, BigNumber } from 'ethers';

import {
  IDIDDocument,
  IDIDLogData,
  IPublicKey,
  IAttributePayload,
  IServiceEndpoint,
  IAuthentication,
  DocumentSelector,
  AttributeChangedEvent,
  DelegateChangedEvent,
  DidEventNames,
} from '@ew-did-registry/did-resolver-interface';
import { attributeNamePattern } from '../constants';
import { matchDIDPattern } from '../utils';

/**
 * This function updates the document if the event type is 'DelegateChange'
 *
 * @param event
 * @param did
 * @param document
 * @param validTo
 * @param block
 */
const handleDelegateChange = (
  event: DelegateChangedEvent,
  did: string,
  document: IDIDLogData,
  validTo: BigNumber,
  block: number
): IDIDLogData => {
  const stringDelegateType = ethers.utils.parseBytes32String(
    event.values.delegateType
  );
  const publicKeyID = `${did}#delegate-${stringDelegateType}-${event.values.delegate}`;
  const publicKeyBlock = document.publicKey[publicKeyID]?.block;
  if (
    document.publicKey[publicKeyID] === undefined ||
    (publicKeyBlock !== undefined && publicKeyBlock < block)
  ) {
    switch (stringDelegateType) {
      case 'sigAuth':
        document.authentication[publicKeyID] = {
          type: 'sigAuth',
          publicKey: publicKeyID,
          validity: validTo,
          block,
        };
      // eslint-disable-next-line no-fallthrough
      case 'veriKey':
        document.publicKey[publicKeyID] = {
          id: publicKeyID,
          type: 'Secp256k1VerificationKey2018',
          controller: did,
          ethereumAddress: event.values.delegate,
          validity: validTo,
          block,
        };
        break;
      default:
        break;
    }
  }
  return document;
};

/**
 * This function updates the document on Attribute change event
 *
 * @param event
 * @param did
 * @param document
 * @param validTo
 * @param block
 */
const handleAttributeChange = (
  event: AttributeChangedEvent,
  did: string,
  document: IDIDLogData,
  validTo: BigNumber,
  block: number
): IDIDLogData => {
  const matchDID = matchDIDPattern(did);
  const identity = matchDID[1];
  const attributeType = event.values.name;
  const stringAttributeType = ethers.utils.parseBytes32String(attributeType);
  const match = stringAttributeType.match(attributeNamePattern);
  if (match) {
    const section = match[1];
    const algo = match[2];
    const type = match[4];
    const encoding = match[6];
    if (section === 'pub') {
      let publicKeysPayload: IAttributePayload;
      try {
        const parsed = JSON.parse(
          Buffer.from(event.values.value.slice(2), 'hex').toString()
        );
        if (typeof parsed === 'object') {
          publicKeysPayload = parsed;
        } else {
          return document;
        }
      } catch (e) {
        return document;
      }
      const pk: IPublicKey = {
        id: `${did}#${publicKeysPayload.tag}`,
        type: `${algo}${type}`,
        controller: identity,
        validity: validTo,
        block,
      };
      const publicKeyBlock = document.publicKey[pk.id]?.block;
      if (
        document.publicKey[pk.id] === undefined ||
        (publicKeyBlock !== undefined && publicKeyBlock < block)
      ) {
        switch (encoding) {
          case null:
          case undefined:
          case 'hex':
            pk.publicKeyHex = publicKeysPayload.publicKey;
            break;
          case 'base64':
            pk.publicKeyBase64 = Buffer.from(
              event.values.value.slice(2),
              'hex'
            ).toString('base64');
            break;
          case 'pem':
            pk.publicKeyPem = Buffer.from(
              event.values.value.slice(2),
              'hex'
            ).toString();
            break;
          default:
            break;
        }
        document.publicKey[pk.id] = pk;
      }
      return document;
    }
    if (section === 'svc') {
      const servicePoint: IServiceEndpoint = JSON.parse(
        Buffer.from(event.values.value.slice(2), 'hex').toString()
      );

      servicePoint.validity = validTo;
      servicePoint.block = block;

      const serviceEndpointBlock = document.service[servicePoint.id]?.block;
      if (
        document.service[servicePoint.id] === undefined ||
        (serviceEndpointBlock !== undefined && serviceEndpointBlock < block)
      ) {
        document.service[servicePoint.id] = servicePoint;
      }
      return document;
    }
    return document;
  }
  const attrBlock = document.attributes.get(stringAttributeType)
    ?.block as number;
  if (!attrBlock || attrBlock < block) {
    const attributeData = {
      attribute: Buffer.from(event.values.value.slice(2), 'hex').toString(),
      validity: validTo,
      block,
    };
    document.attributes.set(stringAttributeType, attributeData);
  }
  return document;
};

/**
 * Update document checks the event validity, and, if valid,
 * passes the event parsing to the handler
 *
 * @param event
 * @param did
 * @param document
 * @param block
 */
const updateDocument = (
  event: AttributeChangedEvent | DelegateChangedEvent,
  did: string,
  document: IDIDLogData,
  block: BigNumber
): IDIDLogData => {
  const { validTo } = event.values;

  if (validTo) {
    switch (event.name) {
      case DidEventNames.AttributeChanged:
        return handleAttributeChange(
          event,
          did,
          document,
          validTo,
          block.toNumber()
        );
      case DidEventNames.DelegateChanged:
        return handleDelegateChange(
          event,
          did,
          document,
          validTo,
          block.toNumber()
        );
      default:
        return document;
    }
  }
  document.topBlock = block;

  return document;
};

/**
 * Get contract events emitted in \[`bottomBlock`, `topBlock`\]
 *
 * @param bottomBlock
 * @param topBlock
 * @param provider
 * @param contractInterface
 * @param contractddress
 */
export const getEventsFromBlocks = (
  bottomBlock: BigNumber,
  topBlock: BigNumber,
  provider: ethers.providers.Provider,
  contractInterface: utils.Interface,
  contractAddress: string
): Promise<
  { block: BigNumber; event: AttributeChangedEvent | DelegateChangedEvent }[]
> =>
  new Promise((resolve, reject) => {
    const events: {
      block: BigNumber;
      event: AttributeChangedEvent | DelegateChangedEvent;
    }[] = [];
    provider
      .getLogs({
        address: contractAddress,
        fromBlock: bottomBlock.toNumber(),
        toBlock: topBlock.toNumber(),
        topics: undefined,
      })
      .then((logs) => {
        for (const log of logs) {
          const { name, args, signature, topic } =
            contractInterface.parseLog(log);
          const event = {
            name,
            values: args,
            signature,
            topic,
          } as unknown as AttributeChangedEvent | DelegateChangedEvent;
          events.push({ block: BigNumber.from(log.blockNumber), event });
        }
        resolve(events);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const query = (
  document: IDIDDocument,
  selector: DocumentSelector
): IPublicKey | IServiceEndpoint | IAuthentication | undefined => {
  const attrName = Object.keys(selector)[0] as keyof DocumentSelector;
  const attributes = Object.values(document[attrName]);
  if (attributes.length === 0) {
    return undefined;
  }
  const filter = Object.entries(
    selector[attrName] as
      | Partial<IPublicKey>
      | Partial<IAuthentication>
      | Partial<IServiceEndpoint>
  );
  return attributes.find((a) =>
    filter.every(([prop, val]) => a[prop] && a[prop] === val)
  );
};

/**
 * Updates document log data from all events
 *
 * @param did
 * @param events
 * @param document
 */
export const createLogsFromEvents = async (
  did: string,
  events: {
    block: BigNumber;
    event: AttributeChangedEvent | DelegateChangedEvent;
  }[],
  document: IDIDLogData
): Promise<void> => {
  for (const event of events) {
    updateDocument(event.event, did, document, event.block);
    document.topBlock = event.block;
  }
};

/**
 * The logs from ERC1056 have a validity and a block number
 */
interface ILogWithValidityAndBlock {
  validity?: BigNumber;
  block?: number;
}

/**
 * Makes a copy of a log event and remove the validity and block
 * The log is used to construct DID Document,
 * but we don't want to include validity and block in DID Document.
 * It ,akes a copy of the logs so as to not remove from the original log
 * (as that log maybe need those properties elsewhere)
 * @param log log event from ERC1056
 * @returns copy of log without validity and block
 */
const copyAndRemoveValidityAndBlock = <T extends ILogWithValidityAndBlock>(
  log: T
): Omit<T, 'validity' | 'block'> => {
  const copy = { ...log };
  if (log.block) {
    delete copy.block;
  }
  if (log.validity) {
    delete copy.validity;
  }
  return copy;
};

/**
 * Provided with the fetched data, the function parses it and returns the
 * DID Document associated with the relevant user
 *
 * @param did
 * @param document
 * @param context
 */
export const wrapDidDocument = (
  did: string,
  document: IDIDLogData,
  context = 'https://www.w3.org/ns/did/v1'
): IDIDDocument => {
  const now = BigNumber.from(Math.floor(new Date().getTime() / 1000));

  const publicKey: IPublicKey[] = [];

  const authentication = [
    {
      type: 'owner',
      publicKey: `${did}#owner`,
      // -1 is preventing BigNumber.from overflow error https://github.com/ethers-io/ethers.js/discussions/1582
      validity: BigNumber.from(Number.MAX_SAFE_INTEGER - 1),
    },
  ];

  const didDocument: IDIDDocument = {
    '@context': context,
    id: did,
    publicKey,
    authentication,
    service: [],
  };

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.publicKey) {
    const pubKey = document.publicKey[key];
    const pubKeyValidity = pubKey.validity?.gt(now);
    if (pubKeyValidity) {
      const pubKeyCopy = copyAndRemoveValidityAndBlock(pubKey);
      didDocument.publicKey.push(pubKeyCopy as IPublicKey);
    }
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.authentication) {
    const authenticator = document.authentication[key];
    const authenticatorValidity = authenticator.validity?.gt(now);
    if (authenticatorValidity) {
      const authenticatorCopy = copyAndRemoveValidityAndBlock(authenticator);
      didDocument.authentication.push(authenticatorCopy as IAuthentication);
    }
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.service) {
    const serviceEndpoint = document.service[key];
    const serviceEndpointValidity = serviceEndpoint.validity?.gt(now);
    if (serviceEndpointValidity) {
      const serviceEndpointCopy =
        copyAndRemoveValidityAndBlock(serviceEndpoint);
      didDocument.service.push(serviceEndpointCopy as IServiceEndpoint);
    }
  }

  return didDocument;
};

/**
 * Restore document from partially read logs
 *
 * @param logs {IDIDLogData[]}
 */
export const mergeLogs = (logs: IDIDLogData[]): IDIDLogData => {
  logs = logs.sort((a, b) => a.topBlock.sub(b.topBlock).toNumber());
  return logs.reduce((doc, log) => {
    doc.service = { ...doc.service, ...log.service };

    doc.publicKey = { ...doc.publicKey, ...log.publicKey };

    doc.authentication = { ...doc.authentication, ...log.authentication };

    return doc;
  }, logs[0]);
};

export const documentFromLogs = (
  did: string,
  logs: IDIDLogData[]
): IDIDDocument => {
  const mergedLogs: IDIDLogData = mergeLogs(logs);

  return wrapDidDocument(did, mergedLogs);
};
