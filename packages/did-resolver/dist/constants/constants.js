"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
// Address of ERC1056 smart contract on Volta
exports.address1056 = '0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af';
// ABI of smart contract that has the address above
exports.abi1056 = [
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'owners',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }, { name: '', type: 'bytes32' }, { name: '', type: 'address' }],
        name: 'delegates',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'nonce',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'changed',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'identity', type: 'address' },
            { indexed: false, name: 'owner', type: 'address' },
            { indexed: false, name: 'previousChange', type: 'uint256' },
        ],
        name: 'DIDOwnerChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'identity', type: 'address' },
            { indexed: false, name: 'delegateType', type: 'bytes32' },
            { indexed: false, name: 'delegate', type: 'address' },
            { indexed: false, name: 'validTo', type: 'uint256' },
            { indexed: false, name: 'previousChange', type: 'uint256' },
        ],
        name: 'DIDDelegateChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'identity', type: 'address' },
            { indexed: false, name: 'name', type: 'bytes32' },
            { indexed: false, name: 'value', type: 'bytes' },
            { indexed: false, name: 'validTo', type: 'uint256' },
            { indexed: false, name: 'previousChange', type: 'uint256' },
        ],
        name: 'DIDAttributeChanged',
        type: 'event',
    },
    {
        constant: true,
        inputs: [{ name: 'identity', type: 'address' }],
        name: 'identityOwner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'delegateType', type: 'bytes32' },
            { name: 'delegate', type: 'address' },
        ],
        name: 'validDelegate',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [{ name: 'identity', type: 'address' }, { name: 'newOwner', type: 'address' }],
        name: 'changeOwner',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'sigV', type: 'uint8' },
            { name: 'sigR', type: 'bytes32' },
            { name: 'sigS', type: 'bytes32' },
            { name: 'newOwner', type: 'address' },
        ],
        name: 'changeOwnerSigned',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'delegateType', type: 'bytes32' },
            { name: 'delegate', type: 'address' },
            { name: 'validity', type: 'uint256' },
        ],
        name: 'addDelegate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'sigV', type: 'uint8' },
            { name: 'sigR', type: 'bytes32' },
            { name: 'sigS', type: 'bytes32' },
            { name: 'delegateType', type: 'bytes32' },
            { name: 'delegate', type: 'address' },
            { name: 'validity', type: 'uint256' },
        ],
        name: 'addDelegateSigned',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'delegateType', type: 'bytes32' },
            { name: 'delegate', type: 'address' },
        ],
        name: 'revokeDelegate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'sigV', type: 'uint8' },
            { name: 'sigR', type: 'bytes32' },
            { name: 'sigS', type: 'bytes32' },
            { name: 'delegateType', type: 'bytes32' },
            { name: 'delegate', type: 'address' },
        ],
        name: 'revokeDelegateSigned',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'name', type: 'bytes32' },
            { name: 'value', type: 'bytes' },
            { name: 'validity', type: 'uint256' },
        ],
        name: 'setAttribute',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'sigV', type: 'uint8' },
            { name: 'sigR', type: 'bytes32' },
            { name: 'sigS', type: 'bytes32' },
            { name: 'name', type: 'bytes32' },
            { name: 'value', type: 'bytes' },
            { name: 'validity', type: 'uint256' },
        ],
        name: 'setAttributeSigned',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'name', type: 'bytes32' },
            { name: 'value', type: 'bytes' },
        ],
        name: 'revokeAttribute',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: 'identity', type: 'address' },
            { name: 'sigV', type: 'uint8' },
            { name: 'sigR', type: 'bytes32' },
            { name: 'sigS', type: 'bytes32' },
            { name: 'name', type: 'bytes32' },
            { name: 'value', type: 'bytes' },
        ],
        name: 'revokeAttributeSigned',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
// Our default endpoint for communication with blockchain
exports.defaultProvider = {
    uriOrInfo: 'http://volta-rpc.energyweb.org/',
    type: models_1.ProviderTypes.HTTP,
};
/**
 * The three above comprise the minimal settings for resolver.
 * One can adjust them to use the resolver with a different provider
 * or with a different smart contract.
 */
exports.defaultResolverSettings = {
    provider: exports.defaultProvider,
    abi: exports.abi1056,
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