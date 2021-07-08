import {
  Contract, ethers, providers, utils,
} from 'ethers';

import {
  IDIDDocument,
  IDIDLogData,
  IVerificationMethod,
  IAttributePayload,
  IServiceEndpoint,
  RegistrySettings,
  IAuthentication,
  DocumentSelector,
  AttributeChangedEvent,
  DelegateChangedEvent,
  DidEventNames,
  VerificationMethodBackTypeMap
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
  validTo: utils.BigNumber,
  block: number,
): IDIDLogData => {
  const stringDelegateType = ethers.utils.parseBytes32String(event.values.delegateType);
  const publicKeyID = `${did}#delegate-${stringDelegateType}-${event.values.delegate}`;
  if (document.verificationMethod[publicKeyID] === undefined
    || document.verificationMethod[publicKeyID].block < block) {
    switch (stringDelegateType) {
      case 'sigAuth':
        document.authentication[publicKeyID] = {
          id: publicKeyID,
          controller: '',
          type: 'Secp256k1VerificationKey2018',
          publicKeyHex: event.values.delegate,
          validity: validTo,
          block,
        };
      // eslint-disable-next-line no-fallthrough
      case 'veriKey':
        document.verificationMethod[publicKeyID] = {
          id: publicKeyID,
          controller: '',
          type: 'Secp256k1VerificationKey2018',
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
  validTo: utils.BigNumber,
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
    const type = match[2] || '';
    const encoding = match[4] || '';
    if (section === 'vm') {
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
      const vm: IVerificationMethod = {
        id: `${did}#${publicKeysPayload.tag}`,
        type: `${VerificationMethodBackTypeMap.get(type)}`,
        controller: "",
        validity: validTo,
        block,
      };
      if ((document.verificationMethod[vm.id] === undefined
        || document.verificationMethod[vm.id].block < block)) {
        switch (encoding) {
          case null:
          case undefined:
          case 'hex':
            vm.publicKeyHex = publicKeysPayload.verificationMethod;
            break;
          case 'base64':
            vm.publicKeyBase64 = Buffer.from(
              event.values.value.slice(2),
              'hex',
            ).toString('base64');
            break;
          case 'pem':
            vm.publicKeyPem = Buffer.from(
              event.values.value.slice(2),
              'hex',
            ).toString();
            break;
          case 'addr':
            vm.ethereumAddress = publicKeysPayload.verificationMethod;
          default:
            break;
        }
        document.verificationMethod[vm.id] = vm;
      }
      return document;
    }
    if (section === 'svc') {
      const servicePoint: IServiceEndpoint = JSON.parse(Buffer.from(
        event.values.value.slice(2),
        'hex',
      ).toString());

      console.log(servicePoint);
      servicePoint.id = `${did}#${type}_${servicePoint.hash}`;
      servicePoint.validity = validTo;
      delete servicePoint.hash;
      servicePoint.block = block;

      if ((document.service[servicePoint.id] === undefined
        || document.service[servicePoint.id].block < block)) {
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
  block: ethers.utils.BigNumber,
  did: string,
  document: IDIDLogData,
  provider: ethers.providers.Provider,
  contractInterface: utils.Interface,
  address: string,
): Promise<unknown> => new Promise((resolve, reject) => {
  const [, , network_id, nft_address, nft_id] = did.split(':');

  provider.getLogs({
    address,
    fromBlock: block.toNumber(),
    toBlock: block.toNumber(),
    topics: [null, `0x000000000000000000000000${nft_address.slice(2).toLowerCase()}`,
        `0x` + ("0000000000000000000000000000000000000000000000000000000000000000" + nft_id).slice(-64)] as string[],
  }).then((log) => {
    const event = contractInterface.parseLog(log[0]) as AttributeChangedEvent |
      DelegateChangedEvent;
    updateDocument(event, did, document, block.toNumber());

    resolve(event.values.previousChange);
  }).catch((error) => {
    reject(error);
  });
});

export const query = (
  document: IDIDDocument, selector: DocumentSelector,
): IVerificationMethod | IServiceEndpoint | IAuthentication | undefined => {
  const attrName = Object.keys(selector)[0] as keyof DocumentSelector;
  const attributes = Object.values(document[attrName]);
  if (attributes.length === 0) {
    return undefined;
  }
  const filter = Object.entries(
    selector[attrName] as
    Partial<IVerificationMethod> | Partial<IAuthentication> | Partial<IServiceEndpoint>,
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
  const [, , network_id, nft_address, nft_id] = did.split(':');

  let nextBlock;
  let topBlock;
  try {
    nextBlock = await contract.changed(nft_address, nft_id);
    topBlock = nextBlock;
  } catch (e) {
    throw new Error('Blockchain address did not interact with smart contract');
  }

  try {
    document.owner = await contract.identityOwner(nft_address, nft_id);
  } catch (e) {
    throw new Error('Invalid NFT');
  }

  if (!document.owner) {
    throw new Error('Invalid NFT');
  }
  const contractInterface = new ethers.utils.Interface(registrySettings.abi);
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
  controller_did: string,
  document: IDIDLogData,
  context = 'https://www.w3.org/ns/did/v1',
): IDIDDocument => {
  const now = new utils.BigNumber(Math.floor(new Date().getTime() / 1000));

  const verificationMethod: IVerificationMethod[] = [
  ];

  const authentication: IAuthentication[] = [
  ];

  // controller of the NFT DID is always the owner of the NFT
  let defaultAuthentication = {
    id: `${did}#controller`,
    type: 'EcdsaSecp256k1RecoveryMethod2020',
    controller: controller_did,
    ethereumAddress: `${did}`,
    validity: new utils.BigNumber(Number.MAX_SAFE_INTEGER),
    block: 0
  };

  const didDocument: IDIDDocument = {
    '@context': context,
    id: did,
    verificationMethod,
    authentication,
    service: [],
  };

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  {
    delete defaultAuthentication.block;
    delete defaultAuthentication.validity;
    didDocument.authentication.push(defaultAuthentication);
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.verificationMethod) {
    const pubKey = document.verificationMethod[key];
    if (pubKey.validity.gt(now)) {
      const pubKeyCopy = { ...pubKey };
      delete pubKeyCopy.validity;
      delete pubKeyCopy.block;
      pubKeyCopy.controller = controller_did;
      didDocument.verificationMethod.push(pubKeyCopy);
    }
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.authentication) {
    const authenticator = document.authentication[key];
    if (authenticator.validity.gt(now)) {
      const authenticatorCopy = { ...authenticator };
      delete authenticatorCopy.validity;
      delete authenticatorCopy.block;
      didDocument.authentication.push(authenticatorCopy);
    }
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const key in document.service) {
    const serviceEndpoint = document.service[key];
    if (serviceEndpoint.validity.gt(now)) {
      const serviceEndpointCopy = { ...serviceEndpoint };
      delete serviceEndpointCopy.validity;
      delete serviceEndpointCopy.block;
      serviceEndpointCopy.controller = controller_did;
      didDocument.service.push(serviceEndpointCopy);
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

      doc.verificationMethod = { ...doc.verificationMethod, ...log.verificationMethod };

      doc.authentication = { ...doc.authentication, ...log.authentication };

      return doc;
    },
    logs[0],
  );
};

export const documentFromLogs = (did: string, did_controller: string, logs: IDIDLogData[]): IDIDDocument => {
  const mergedLogs: IDIDLogData = mergeLogs(logs);

  return wrapDidDocument(did, did_controller, mergedLogs);
};
