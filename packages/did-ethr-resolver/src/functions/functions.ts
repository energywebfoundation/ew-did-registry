import {
  Contract, ethers, providers, utils, BigNumber,
} from 'ethers';

import {
  IDIDDocument,
  IDIDLogData,
  IPublicKey,
  IAttributePayload,
  IServiceEndpoint,
  RegistrySettings,
  IAuthentication,
  DocumentSelector,
  AttributeChangedEvent,
  DelegateChangedEvent,
  DidEventNames,
} from '@ew-did-registry/did-resolver-interface';
import { DIDPattern } from '@ew-did-registry/did';
import { attributeNamePattern } from '../constants';

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
  block: number,
): IDIDLogData => {
  const stringDelegateType = ethers.utils.parseBytes32String(event.values.delegateType);
  const publicKeyID = `${did}#delegate-${stringDelegateType}-${event.values.delegate}`;
  const publicKeyBlock = document.publicKey[publicKeyID]?.block;
  if (document.publicKey[publicKeyID] === undefined
    || (publicKeyBlock !== undefined && publicKeyBlock < block)) {
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
  block: number,
): IDIDLogData => {
  let match = did.match(DIDPattern);
  if (!match) {
    throw new Error('Invalid DID');
  }
  const identity = match[1];
  const attributeType = event.values.name;
  const stringAttributeType = ethers.utils.parseBytes32String(attributeType);
  match = stringAttributeType.match(attributeNamePattern);
  if (match) {
    const section = match[1];
    const algo = match[2];
    const type = match[4];
    const encoding = match[6];
    if (section === 'pub') {
      let publicKeysPayload: IAttributePayload;
      try {
        const parsed = JSON.parse(Buffer.from(event.values.value.slice(2), 'hex').toString());
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
      if (document.publicKey[pk.id] === undefined
        || (publicKeyBlock !== undefined && publicKeyBlock < block)) {
        switch (encoding) {
          case null:
          case undefined:
          case 'hex':
            pk.publicKeyHex = publicKeysPayload.publicKey;
            break;
          case 'base64':
            pk.publicKeyBase64 = Buffer.from(
              event.values.value.slice(2),
              'hex',
            ).toString('base64');
            break;
          case 'pem':
            pk.publicKeyPem = Buffer.from(
              event.values.value.slice(2),
              'hex',
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
      const servicePoint: IServiceEndpoint = JSON.parse(Buffer.from(
        event.values.value.slice(2),
        'hex',
      ).toString());

      servicePoint.validity = validTo;
      servicePoint.block = block;

      const serviceEndpointBlock = document.service[servicePoint.id]?.block;
      if (document.service[servicePoint.id] === undefined
        || (serviceEndpointBlock !== undefined && serviceEndpointBlock < block)) {
        document.service[servicePoint.id] = servicePoint;
      }
      return document;
    }
    return document;
  }
  const attrBlock = document.attributes.get(stringAttributeType)?.block as number;
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
 * @param eventName
 * @param did
 * @param document
 * @param block
 */
const updateDocument = (
  event: AttributeChangedEvent | DelegateChangedEvent,
  did: string,
  document: IDIDLogData,
  block: number,
): IDIDLogData => {
  const { validTo } = event.values;

  if (validTo) {
    switch (event.name) {
      case DidEventNames.AttributeChanged:
        return handleAttributeChange(event, did, document, validTo, block);
      case DidEventNames.DelegateChanged:
        return handleDelegateChange(event, did, document, validTo, block);
      default:
        return document;
    }
  }
  return document;
};

/**
 * Given a certain block from the chain, this function returns the events
 * associated with the did within the block
 *
 * @param block
 * @param did
 * @param document
 * @param provider
 * @param contractInterface
 * @param address
 */
const getEventsFromBlock = (
  block: ethers.BigNumber,
  did: string,
  document: IDIDLogData,
  provider: ethers.providers.Provider,
  contractInterface: utils.Interface,
  address: string,
): Promise<unknown> => new Promise((resolve, reject) => {
  const [, , identity] = did.split(':');

  provider.getLogs({
    address,
    fromBlock: block.toNumber(),
    toBlock: block.toNumber(),
    topics: [null, `0x000000000000000000000000${identity.slice(2).toLowerCase()}`] as string[],
  }).then((log) => {
    const {
      name, args, signature, topic,
    } = contractInterface.parseLog(log[0]);
    const event = {
      name, values: args, signature, topic,
    } as unknown as AttributeChangedEvent |
      DelegateChangedEvent;
    updateDocument(event, did, document, block.toNumber());

    resolve(event.values.previousChange);
  }).catch((error) => {
    reject(error);
  });
});

export const query = (
  document: IDIDDocument, selector: DocumentSelector,
): IPublicKey | IServiceEndpoint | IAuthentication | undefined => {
  const attrName = Object.keys(selector)[0] as keyof DocumentSelector;
  const attributes = Object.values(document[attrName]);
  if (attributes.length === 0) {
    return undefined;
  }
  const filter = Object.entries(
    selector[attrName] as
    Partial<IPublicKey> | Partial<IAuthentication> | Partial<IServiceEndpoint>,
  );
  return attributes.find((a) => filter.every(([prop, val]) => a[prop] && a[prop] === val));
};

/**
 * A high level function that manages the flow to read data from the blockchain
 *
 * @param did
 * @param document
 * @param registrySettings
 * @param contract
 * @param provider
 */
export const fetchDataFromEvents = async (
  did: string,
  document: IDIDLogData,
  registrySettings: Required<RegistrySettings>,
  contract: Contract,
  provider: providers.Provider,
  selector?: DocumentSelector,
): Promise<void> => {
  const [, , identity] = did.split(':');
  let nextBlock;
  let topBlock;
  try {
    nextBlock = await contract.changed(identity);
    topBlock = nextBlock;
  } catch (error) {
    throw new Error('Blockchain address did not interact with smart contract');
  }

  if (nextBlock) {
    document.owner = await contract.owners(identity);
  } else {
    document.owner = identity;
  }

  const contractInterface = new ethers.utils.Interface(JSON.stringify(registrySettings.abi));
  const { address } = registrySettings;
  while (
    nextBlock.toNumber() !== 0
    && nextBlock.toNumber() >= document.topBlock.toNumber()
  ) {
    // eslint-disable-next-line no-await-in-loop
    nextBlock = await getEventsFromBlock(
      nextBlock,
      did,
      document,
      provider,
      contractInterface,
      address,
    );
    if (selector) {
      const attribute = query(document as unknown as IDIDDocument, selector);
      if (attribute) {
        return;
      }
    }
  }
  document.topBlock = topBlock;
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
  context = 'https://www.w3.org/ns/did/v1',
): IDIDDocument => {
  const now = BigNumber.from(Math.floor(new Date().getTime() / 1000));

  const publicKey: IPublicKey[] = [
  ];

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
      const { validity, block, ...pubKeyCopy } = { ...pubKey };
      didDocument.publicKey.push(pubKeyCopy as IPublicKey);
    }
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.authentication) {
    const authenticator = document.authentication[key];
    const authenticatorValidity = authenticator.validity?.gt(now);
    if (authenticatorValidity) {
      const { validity, block, ...authenticatorCopy } = { ...authenticator };
      didDocument.authentication.push(authenticatorCopy as IAuthentication);
    }
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.service) {
    const serviceEndpoint = document.service[key];
    const serviceEndpointValidity = serviceEndpoint.validity?.gt(now);
    if (serviceEndpointValidity) {
      const { validity, block, ...serviceEndpointCopy } = { ...serviceEndpoint };
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
  return logs.reduce(
    (doc, log) => {
      doc.service = { ...doc.service, ...log.service };

      doc.publicKey = { ...doc.publicKey, ...log.publicKey };

      doc.authentication = { ...doc.authentication, ...log.authentication };

      return doc;
    },
    logs[0],
  );
};

export const documentFromLogs = (did: string, logs: IDIDLogData[]): IDIDDocument => {
  const mergedLogs: IDIDLogData = mergeLogs(logs);

  return wrapDidDocument(did, mergedLogs);
};
