export declare enum DIDAttribute {
    PublicKey = "pub",
    Authenticate = "auth",
    ServicePoint = "svc"
}
export declare enum PubKeyType {
    SignatureAuthentication2018 = "sigAuth",
    VerificationKey2018 = "veriKey"
}
export declare enum Encoding {
    HEX = "hex",
    BASE64 = "base64",
    PEM = "pem",
    BASE58 = "base58"
}
export declare enum Algorithms {
    ED25519 = "Ed25519",
    RSA = "Rsa",
    ECDSA = "ECDSA",
    Secp256k1 = "Secp256k1"
}
/**
 * Data used to update DID Document. To update the public key you need to set its value in value
 * field, and to set authentication method, the delegate ethereum address must be set in the
 * delegate field
 */
export interface IUpdateData {
    encoding: Encoding;
    algo: Algorithms;
    type: PubKeyType;
    value?: string;
    delegate?: string;
}
