"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var EthereumDIDRegistry_1 = require("./EthereumDIDRegistry");
// Address of ERC1056 smart contract on Volta
exports.address1056 = '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af';
// ABI of smart contract that has the address above
exports.abi1056 = EthereumDIDRegistry_1.ethrReg.abi;
// Our default endpoint for communication with blockchain
exports.defaultProvider = {
    // uriOrInfo: 'http://volta-rpc.energyweb.org/',
    uriOrInfo: 'http://localhost:8544',
    type: models_1.ProviderTypes.HTTP,
};
/**
 * The three above comprise the minimal settings for resolver.
 * One can adjust them to use the resolver with a different provider
 * or with a different smart contract.
 */
exports.defaultResolverSettings = {
    provider: exports.defaultProvider,
    abi: EthereumDIDRegistry_1.ethrReg.abi,
    address: exports.address1056,
};
// Various patterns to minimise errors
exports.matchingPatternDidEvents = /^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/;
exports.matchingPatternDid = /did:[a-z0-9]+:0x[A-Za-z0-9]{40}/;
exports.ethAddrPattern = '0x[A-Fa-f0-9]{40}';
exports.delegatePubKeyIdPattern = "^did:ewc:" + exports.ethAddrPattern + "#delegate-(sigAuth|veriKey)-(" + exports.ethAddrPattern + ")$";
exports.pubKeyIdPattern = "^did:ewc:" + exports.ethAddrPattern + "#key-([A-Za-z0-9]*)(sigAuth|veriKey)";
exports.serviceIdPattern = "^did:ewc:" + exports.ethAddrPattern + "#service-([A-Za-z0-9]+)-([A-Za-z0-9]+)$";
//# sourceMappingURL=constants.js.map