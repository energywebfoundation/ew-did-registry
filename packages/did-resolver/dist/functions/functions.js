"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var utils_1 = require("ethers/utils");
var constants_1 = require("../constants");
var handleDelegateChange = function (event, did, document, validTo, block) {
    var stringDelegateType = ethers_1.ethers.utils.parseBytes32String(event.values.delegateType);
    var publicKeyID = did + "#delegate-" + stringDelegateType + "-" + event.values.delegate;
    if (document.publicKey[publicKeyID] === undefined
        || document.publicKey[publicKeyID].block < block) {
        switch (stringDelegateType) {
            case 'sigAuth':
                document.authentication[publicKeyID] = {
                    type: 'sigAuth',
                    publicKey: publicKeyID,
                    validity: validTo,
                    block: block,
                };
            // eslint-disable-next-line no-fallthrough
            case 'veriKey':
                document.publicKey[publicKeyID] = {
                    id: publicKeyID,
                    type: 'Secp256k1VerificationKey2018',
                    controller: did,
                    ethereumAddress: event.values.delegate,
                    validity: validTo,
                    block: block,
                };
                break;
            default:
                break;
        }
    }
    return document;
};
var handleAttributeChange = function (event, did, document, validTo, block) {
    var _a = did.split(':'), blockchainAddress = _a[2];
    var attributeType = event.values.name;
    var stringAttributeType = ethers_1.ethers.utils.parseBytes32String(attributeType);
    var match = stringAttributeType.match(constants_1.matchingPatternDidEvents);
    if (match) {
        var section = match[1];
        var algo = match[2];
        var type = match[4];
        var encoding = match[6];
        switch (section) {
            case 'pub':
                // eslint-disable-next-line no-case-declarations
                var pk = {
                    // method should be defined from did provided
                    id: did + "#key-" + algo + type + "-" + event.values.value,
                    type: "" + algo + type,
                    controller: blockchainAddress,
                    validity: validTo,
                    block: block,
                };
                if (document.publicKey[pk.id] === undefined
                    || document.publicKey[pk.id].block < block) {
                    switch (encoding) {
                        case null:
                        case undefined:
                        case 'hex':
                            pk.publicKeyHex = Buffer.from(event.values.value.slice(2), 'hex').toString();
                            break;
                        case 'base64':
                            pk.publicKeyBase64 = Buffer.from(event.values.value.slice(2), 'hex').toString('base64');
                            break;
                        case 'base58':
                            pk.publicKeyBase58 = Buffer.from(event.values.value.slice(2), 'hex').toString('base58');
                            break;
                        case 'pem':
                            pk.publicKeyPem = Buffer.from(event.values.value.slice(2), 'hex').toString();
                            break;
                        default:
                            break;
                    }
                    document.publicKey[pk.id] = pk;
                }
                return document;
            case 'svc':
                // eslint-disable-next-line no-case-declarations
                var serviceId = did + "#service-" + algo + "-" + event.values.value;
                if (document.serviceEndpoints[serviceId] === undefined
                    || document.serviceEndpoints[serviceId].block < block) {
                    document.serviceEndpoints[serviceId] = {
                        id: serviceId,
                        type: algo,
                        serviceEndpoint: Buffer.from(event.values.value.slice(2), 'hex').toString(),
                        validity: validTo,
                        block: block,
                    };
                    return document;
                }
                break;
            default:
                break;
        }
    }
    else if (document.attributes.get(stringAttributeType) === undefined
        || (document.attributes.get(stringAttributeType)).block < block) {
        var attributeData = {
            attribute: Buffer.from(event.values.value.slice(2), 'hex').toString(),
            validity: validTo,
            block: block,
        };
        document.attributes.set(stringAttributeType, attributeData);
        return document;
    }
    return document;
};
var handlers = {
    DIDDelegateChanged: handleDelegateChange,
    DIDAttributeChanged: handleAttributeChange,
};
var updateDocument = function (event, eventName, did, document, block) {
    var validTo = event.values.validTo;
    if (validTo) {
        var handler = handlers[eventName];
        return handler(event, did, document, validTo, block);
    }
    return document;
};
var getEventsFromBlock = function (block, did, document, provider, smartContractInterface, smartContractAddress) { return new Promise(function (resolve, reject) {
    var _a = did.split(':'), blockchainAddress = _a[2];
    var topics = [null, "0x000000000000000000000000" + blockchainAddress.slice(2)];
    provider.getLogs({
        address: smartContractAddress,
        fromBlock: block.toNumber(),
        toBlock: block.toNumber(),
        topics: topics,
    }).then(function (Log) {
        var event = smartContractInterface.parseLog(Log[0]);
        var eventName = event.name;
        updateDocument(event, eventName, did, document, block.toNumber());
        resolve(event.values.previousChange);
    }).catch(function (error) {
        reject(error);
    });
}); };
exports.fetchDataFromEvents = function (did, document, resolverSettings, contract, provider) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, blockchainAddress, previousChangedBlock, lastChangedBlock, error_1, _b, smartContractInterface, smartContractAddress;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = did.split(':'), blockchainAddress = _a[2];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, contract.changed(blockchainAddress)];
            case 2:
                previousChangedBlock = _c.sent();
                lastChangedBlock = previousChangedBlock;
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                throw new Error('Blockchain address did not interact with smart contract');
            case 4:
                if (!previousChangedBlock) return [3 /*break*/, 6];
                _b = document;
                return [4 /*yield*/, contract.owners(blockchainAddress)];
            case 5:
                _b.owner = _c.sent();
                return [3 /*break*/, 7];
            case 6:
                document.owner = blockchainAddress;
                _c.label = 7;
            case 7:
                smartContractInterface = new ethers_1.ethers.utils.Interface(resolverSettings.abi);
                smartContractAddress = resolverSettings.address;
                _c.label = 8;
            case 8:
                if (!(previousChangedBlock.toNumber() !== 0
                    && previousChangedBlock.toNumber() !== document.lastChangedBlock.toNumber())) return [3 /*break*/, 10];
                return [4 /*yield*/, getEventsFromBlock(previousChangedBlock, did, document, provider, smartContractInterface, smartContractAddress)];
            case 9:
                // eslint-disable-next-line no-await-in-loop
                previousChangedBlock = _c.sent();
                return [3 /*break*/, 8];
            case 10:
                document.lastChangedBlock = lastChangedBlock;
                return [2 /*return*/];
        }
    });
}); };
exports.wrapDidDocument = function (did, document, context) {
    if (context === void 0) { context = 'https://www.w3.org/ns/did/v1'; }
    var now = new utils_1.BigNumber(Math.floor(new Date().getTime() / 1000));
    var publicKey = [];
    var authentication = [
        {
            type: 'owner',
            publicKey: did + "#owner",
        },
    ];
    var didDocument = {
        '@context': context,
        id: did,
        publicKey: publicKey,
        authentication: authentication,
        service: [],
    };
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (var key in document.publicKey) {
        var pubKey = document.publicKey[key];
        if (pubKey.validity.gt(now)) {
            var pubKeyCopy = __assign({}, pubKey);
            delete pubKeyCopy.validity;
            delete pubKeyCopy.block;
            didDocument.publicKey.push(pubKeyCopy);
        }
    }
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (var key in document.authentication) {
        var authenticator = document.authentication[key];
        if (authenticator.validity.gt(now)) {
            var authenticatorCopy = __assign({}, authenticator);
            delete authenticatorCopy.validity;
            delete authenticatorCopy.block;
            didDocument.authentication.push(authenticatorCopy);
        }
    }
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (var key in document.serviceEndpoints) {
        var serviceEndpoint = document.serviceEndpoints[key];
        if (serviceEndpoint.validity.gt(now)) {
            var serviceEndpointCopy = __assign({}, serviceEndpoint);
            delete serviceEndpointCopy.validity;
            delete serviceEndpointCopy.block;
            didDocument.service.push(serviceEndpoint);
        }
    }
    return didDocument;
};
//# sourceMappingURL=functions.js.map