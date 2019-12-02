"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECDSA_PATTERNS = {
    secp256k1: {
        PRIVATE_KEY: /^[a-f0-9]{64}$/,
        PUBLIC_KEY: /^[a-f0-9]{66}$/,
        SIGNATURE: /^[a-f0-9]{128}$/,
    },
};
//# sourceMappingURL=index.js.map