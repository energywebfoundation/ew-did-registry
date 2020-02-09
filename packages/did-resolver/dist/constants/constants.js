"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Address of ERC1056 smart contract on Volta
exports.voltaAddress1056 = '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af';
// Various patterns to minimise errors
exports.matchingPatternDidEvents = /^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/;
exports.matchingPatternDid = /did:[a-z0-9]+:0x[A-Za-z0-9]{40}/;
exports.ethAddrPattern = '0x[A-Fa-f0-9]{40}';
exports.delegatePubKeyIdPattern = "^did:ewc:" + exports.ethAddrPattern + "#delegate-(sigAuth|veriKey)-(" + exports.ethAddrPattern + ")$";
exports.pubKeyIdPattern = "^did:ewc:" + exports.ethAddrPattern + "#key-([A-Za-z0-9]*)(sigAuth|veriKey)";
exports.serviceIdPattern = "^did:ewc:" + exports.ethAddrPattern + "#service-([A-Za-z0-9]+)-([A-Za-z0-9]+)$";
//# sourceMappingURL=constants.js.map