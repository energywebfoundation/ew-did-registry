import { Contract, ethers } from 'ethers';
import { BaseProvider } from 'ethers/providers';

import { BigNumber, Interface } from 'ethers/utils';

import {
  IDIDDocument,
  IDIDLogData,
  ISmartContractEvent,
  IResolverSettings,
  IPublicKey,
  IHandlers,
} from '../models';

import { matchingPatternDidEvents } from '../constants';

const handleDelegateChange = (
  event: ISmartContractEvent,
  did: string,
  document: IDIDLogData,
  validTo: BigNumber,
  block: number,
): IDIDLogData => {
  const publicKeyID = `${did}#delegate-${event.values.delegate}`;
  if (document.publicKey[publicKeyID] === undefined
    || document.publicKey[publicKeyID].block < block) {
    const { delegateType } = event.values;
    const stringDelegateType = ethers.utils.parseBytes32String(delegateType);
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

const handleAttributeChange = (
  event: ISmartContractEvent,
  did: string,
  document: IDIDLogData,
  validTo: BigNumber,
  block: number,
): IDIDLogData => {
  const [, , blockchainAddress] = did.split(':');
  const attributeType = event.values.name;
  const stringAttributeType = ethers.utils.parseBytes32String(attributeType);
  const match = stringAttributeType.match(matchingPatternDidEvents);
  if (match) {
    const section = match[1];
    const algo = match[2];
    const type = match[4];
    const encoding = match[6];
    switch (section) {
      case 'pub':
        // eslint-disable-next-line no-case-declarations
        const pk: IPublicKey = {
          // method should be defined from did provided
          id: `${did}#key-${type}`,
          type: `${algo}${type}`,
          controller: blockchainAddress,
          validity: validTo,
          block,
        };
        if (document.publicKey[pk.id] === undefined
          || document.publicKey[pk.id].block < block) {
          switch (encoding) {
            case null:
            case undefined:
            case 'hex':
              pk.publicKeyHex = Buffer.from(
                event.values.value.slice(2),
                'hex',
              ).toString();
              break;
            case 'base64':
              pk.publicKeyBase64 = Buffer.from(
                event.values.value.slice(2),
                'hex',
              ).toString('base64');
              break;
            case 'base58':
              pk.publicKeyBase58 = Buffer.from(
                event.values.value.slice(2),
                'hex',
              ).toString('base58');
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
      case 'svc':
        if (document.serviceEndpoints[algo] === undefined
          || document.serviceEndpoints[algo].block < block) {
          document.serviceEndpoints[algo] = {
            id: `${did}#${algo}`,
            type: algo,
            serviceEndpoint: Buffer.from(
              event.values.value.slice(2),
              'hex',
            ).toString(),
            validity: validTo,
            block,
          };
          return document;
        }
        break;
      default:
        break;
    }
  } else if (document.attributes.get(stringAttributeType) === undefined
    || (document.attributes.get(stringAttributeType)).block < block) {
    const attributeData = {
      attribute: Buffer.from(event.values.value.slice(2), 'hex').toString(),
      validity: validTo,
      block,
    };
    document.attributes.set(stringAttributeType, attributeData);
    return document;
  }
  return document;
};

const handlers: IHandlers = {
  DIDDelegateChanged: handleDelegateChange,
  DIDAttributeChanged: handleAttributeChange,
};

const updateDocument = (
  event: ISmartContractEvent,
  eventName: string,
  did: string,
  document: IDIDLogData,
  block: number,
): IDIDLogData => {
  const { validTo } = event.values;

  if (validTo) {
    const handler = handlers[eventName];
    return handler(event, did, document, validTo, block);
  }

  return document;
};

const getEventsFromBlock = (
  block: ethers.utils.BigNumber,
  did: string,
  document: IDIDLogData,
  provider: ethers.providers.BaseProvider,
  smartContractInterface: Interface,
  smartContractAddress: string,
): Promise<unknown> => new Promise((resolve, reject) => {
  const [, , blockchainAddress] = did.split(':');
  const topics = [null, `0x000000000000000000000000${blockchainAddress.slice(2)}`];

  provider.getLogs({
    address: smartContractAddress,
    fromBlock: block.toNumber(),
    toBlock: block.toNumber(),
    topics,
  }).then((Log) => {
    const event = smartContractInterface.parseLog(Log[0]);
    const eventName = event.name;
    updateDocument(event, eventName, did, document, block.toNumber());

    resolve(event.values.previousChange);
  }).catch((error) => {
    reject(error);
  });
});

export const fetchDataFromEvents = async (
  did: string,
  document: IDIDLogData,
  resolverSettings: IResolverSettings,
  contract: Contract,
  provider: BaseProvider,
): Promise<void> => {
  const [, , blockchainAddress] = did.split(':');

  let previousChangedBlock;
  let lastChangedBlock;
  try {
    previousChangedBlock = await contract.changed(blockchainAddress);
    lastChangedBlock = previousChangedBlock;
  } catch (error) {
    throw new Error('Blockchain address did not interact with smart contract');
  }

  if (previousChangedBlock) {
    document.owner = await contract.owners(blockchainAddress);
  } else {
    document.owner = blockchainAddress;
  }

  const smartContractInterface = new ethers.utils.Interface(resolverSettings.abi);
  const smartContractAddress = resolverSettings.address;
  while (
    previousChangedBlock.toNumber() !== 0
    && previousChangedBlock.toNumber() !== document.lastChangedBlock.toNumber()
  ) {
    // eslint-disable-next-line no-await-in-loop
    previousChangedBlock = await getEventsFromBlock(
      previousChangedBlock,
      did,
      document,
      provider,
      smartContractInterface,
      smartContractAddress,
    );
  }
  document.lastChangedBlock = lastChangedBlock;
};

export const wrapDidDocument = (
  did: string,
  document: IDIDLogData,
  context = 'https://www.w3.org/ns/did/v1',
): IDIDDocument => {
  const now = new BigNumber(Math.floor(new Date().getTime() / 1000));

  const publicKey: IPublicKey[] = [
    {
      id: `${did}#owner`,
      type: 'Secp256k1VerificationKey',
      controller: did,
      ethereumAddress: document.owner,
    },
  ];

  const authentication = [
    {
      type: 'owner',
      publicKey: `${did}#owner`,
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
    if (pubKey.validity.gt(now)) {
      const pubKeyCopy = { ...pubKey };
      delete pubKeyCopy.validity;
      delete pubKeyCopy.block;
      didDocument.publicKey.push(pubKeyCopy);
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
  for (const key in document.serviceEndpoints) {
    const serviceEndpoint = document.serviceEndpoints[key];
    if (serviceEndpoint.validity.gt(now)) {
      const serviceEndpointCopy = { ...serviceEndpoint };
      delete serviceEndpointCopy.validity;
      delete serviceEndpointCopy.block;
      didDocument.service.push(serviceEndpoint);
    }
  }

  return didDocument;
};
