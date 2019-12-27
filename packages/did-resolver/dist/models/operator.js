"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIDAttribute;
(function (DIDAttribute) {
    DIDAttribute["PublicKey"] = "pub";
    DIDAttribute["Authenticate"] = "auth";
    DIDAttribute["ServicePoint"] = "svc";
})(DIDAttribute = exports.DIDAttribute || (exports.DIDAttribute = {}));
var PubKeyType;
(function (PubKeyType) {
    PubKeyType["SignatureAuthentication2018"] = "sigAuth";
    PubKeyType["VerificationKey2018"] = "veriKey";
})(PubKeyType = exports.PubKeyType || (exports.PubKeyType = {}));
var Encoding;
(function (Encoding) {
    Encoding["HEX"] = "hex";
    Encoding["BASE64"] = "base64";
    Encoding["PEM"] = "pem";
    Encoding["BASE58"] = "base58";
})(Encoding = exports.Encoding || (exports.Encoding = {}));
var Algorithms;
(function (Algorithms) {
    Algorithms["ED25519"] = "Ed25519";
    Algorithms["RSA"] = "rsa";
    Algorithms["ECDSA"] = "ecdsa";
})(Algorithms = exports.Algorithms || (exports.Algorithms = {}));
//# sourceMappingURL=operator.js.map