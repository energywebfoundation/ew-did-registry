import { ethers } from 'ethers';

import {
  IDIDDocument,
  IDIDLogData,
  ISmartContractEvent,
  IResolverSettings,
  IPublicKey,
  IHandlers,
} from '../models';

import { matchingPatternDidEvents } from '../constants';

const handleDelegateChange = (event: ISmartContractEvent, id: string, document: IDIDLogData) => {
  const publicKeyID = `${id}#delegate-${event.values.delegate}`;

  if (document.publicKey[publicKeyID] === undefined) {
    const { delegateType } = event.values;
    const stringDelegateType = ethers.utils.parseBytes32String(delegateType);
    switch (stringDelegateType) {
      case 'sigAuth':
        document.authentication[publicKeyID] = publicKeyID;
        // eslint-disable-next-line no-fallthrough
      case 'veriKey':
        document.publicKey[publicKeyID] = {
          id: publicKeyID,
          type: 'Secp256k1VerificationKey2018',
          controller: `did:ewc:${id}`,
          ethereumAddress: event.values.delegate,
        };
        break;
      default:
        break;
    }
  }

  return document;
};

const handleAttributeChange = (event: ISmartContractEvent,
  etherAddress: string,
  document: IDIDLogData) => {
  const attributeType = event.values.name;
  // console.log(`attributeType length is ${attributeType.length}`);
  const stringAttributeType = ethers.utils.parseBytes32String(attributeType);
  const match = stringAttributeType.match(matchingPatternDidEvents);
  // console.log(match);
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
          id: `did:ewc:${etherAddress}#key-${type}`,
          type: `${algo}${type}`,
          controller: etherAddress,
        };
        if (document.publicKey[pk.id] === undefined) {
          switch (encoding) {
            case null:
            case undefined:
            case 'hex':
              pk.publicKeyHex = Buffer.from(
                event.values.value.slice(2),
                'hex',
              ).toString('hex');
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
        if (document.serviceEndpoints[algo] === undefined) {
          document.serviceEndpoints[algo] = {
            id: `did:ewc:${etherAddress}#${algo}`,
            type: algo,
            serviceEndpoint: Buffer.from(
              event.values.value.slice(2),
              'hex',
            ).toString(),
          };
          return document;
        }
        break;
      default:
        break;
    }
  } else if (document.attributes.get(stringAttributeType) === undefined) {
    const attributeData = {
      attribute: Buffer.from(event.values.value.slice(2), 'hex').toString(),
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

const updateDocument = (event: ISmartContractEvent,
  eventName: string,
  etherAddress: string,
  document: IDIDLogData) => {
  const now = new ethers.utils.BigNumber(Math.floor(new Date().getTime() / 1000));

  const { validTo } = event.values;

  if (validTo && validTo.gt(now)) {
    const handler = handlers[eventName];
    return handler(event, etherAddress, document);
  }

  return true;
};

const getEventsFromBlock = (block: ethers.utils.BigNumber,
  etherAddress: string,
  document: IDIDLogData,
  provider: ethers.providers.JsonRpcProvider,
  resolverSettings: IResolverSettings) => new Promise((resolve, reject) => {
  const topics = [null, `0x000000000000000000000000${etherAddress.slice(2)}`];
  const smartContractInterface = new ethers.utils.Interface(resolverSettings.abi);

  provider.getLogs({
    address: resolverSettings.address,
    fromBlock: block.toNumber(),
    toBlock: block.toNumber(),
    topics,
  }).then((Log) => {
    const event = smartContractInterface.parseLog(Log[0]);
    // console.log('This is out event:\n');
    // console.log(event);
    const eventName = event.name;
    updateDocument(event, eventName, etherAddress, document);

    resolve(event.values.previousChange);
  }).catch((error) => {
    reject(error);
  });
});

export const fetchDataFromEvents = async (etherAddress: string,
  document: IDIDLogData,
  resolverSettings: IResolverSettings) => {
  const provider = new ethers.providers.JsonRpcProvider(resolverSettings.provider.uri);

  const contract = new ethers.Contract(resolverSettings.address, resolverSettings.abi, provider);

  let previousChangedBlock = await contract.changed(etherAddress);
  if (previousChangedBlock) {
    document.owner = await contract.owners(etherAddress);
  } else {
    document.owner = etherAddress;
  }
  while (previousChangedBlock.toNumber() !== 0) {
    // eslint-disable-next-line no-await-in-loop
    previousChangedBlock = await getEventsFromBlock(
      previousChangedBlock,
      etherAddress,
      document,
      provider,
      resolverSettings,
    );
  }
};

export const wrapDidDocument = (address: string, document: IDIDLogData, context = 'https://www.w3.org/ns/did/v1') => {
  const did = `did:ewc:${address}`;
  const publicKey: IPublicKey[] = [
    {
      id: `${did}#owner`,
      type: 'Secp256k1VerificationKey2018',
      controller: did,
      ethereumAddress: address,
    },
  ];

  const authentication = [
    `${did}#owner`,
  ];

  const didDocument: IDIDDocument = {
    '@context': context,
    id: did,
    publicKey: publicKey.concat(Object.values(document.publicKey)),
    authentication: authentication.concat(Object.values(document.authentication)),
  };
  if (document.serviceEndpoints !== undefined) {
    didDocument.service = Object.values(document.serviceEndpoints);
  }
  return didDocument;
};
