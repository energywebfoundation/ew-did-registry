"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Currently, there are three types of DID Attributes, this can be potentially extended
 */
var DIDAttribute;
(function (DIDAttribute) {
    DIDAttribute["PublicKey"] = "pub";
    DIDAttribute["Authenticate"] = "auth";
    DIDAttribute["ServicePoint"] = "svc";
})(DIDAttribute = exports.DIDAttribute || (exports.DIDAttribute = {}));
/**
 * The two main types of public keys are, in turn, verification key and signature authentication key
 */
var PubKeyType;
(function (PubKeyType) {
    PubKeyType["SignatureAuthentication2018"] = "sigAuth";
    PubKeyType["VerificationKey2018"] = "veriKey";
})(PubKeyType = exports.PubKeyType || (exports.PubKeyType = {}));
/**
 * Encoding specifies the format in which the public key is store
 */
var Encoding;
(function (Encoding) {
    Encoding["HEX"] = "hex";
    Encoding["BASE64"] = "base64";
    Encoding["PEM"] = "pem";
    Encoding["BASE58"] = "base58";
})(Encoding = exports.Encoding || (exports.Encoding = {}));
/**
 * Algorithms specifies, which algorithm has to be used with a particular public key
 */
var Algorithms;
(function (Algorithms) {
    Algorithms["ED25519"] = "Ed25519";
    Algorithms["RSA"] = "Rsa";
    Algorithms["ECDSA"] = "ECDSA";
    Algorithms["Secp256k1"] = "Secp256k1";
})(Algorithms = exports.Algorithms || (exports.Algorithms = {}));
//# sourceMappingURL=operator.js.map