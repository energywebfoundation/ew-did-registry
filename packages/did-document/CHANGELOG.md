# Change Log

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.8.0...v0.9.0) (2023-07-20)

### Bug Fixes

- upgrade dependencies ([ae2dcf7](https://github.com/energywebfoundation/ew-did-registry/commit/ae2dcf717068d433c646e519d8e1c989837511c6))

# [0.8.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.7.0...v0.8.0) (2022-09-29)

**Note:** Version bump only for package @ew-did-registry/did-document

# [0.7.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.2...v0.7.0) (2022-08-09)

### Bug Fixes

- validate credential status without status list ([4308f21](https://github.com/energywebfoundation/ew-did-registry/commit/4308f21a86ddd543365d9a24f7ffab8903ea0941))

### Features

- **@ew-did-registry/jwt:** verify ES256 ([028fb9c](https://github.com/energywebfoundation/ew-did-registry/commit/028fb9cd9ad5f123ecd47c5842bf8e5d21e2c022))
- **build:** config packages webpack ([33ae38d](https://github.com/energywebfoundation/ew-did-registry/commit/33ae38d72027c262c0e80e96c9a7fefc7bb5bd90))
- **build:** polyfill Node.js modules ([42c5e23](https://github.com/energywebfoundation/ew-did-registry/commit/42c5e23d6c8356ec473d2730beeb1d7b8c3208ed))
- **did:** updatePublicKey and updateDelegate in did ([9b0ba02](https://github.com/energywebfoundation/ew-did-registry/commit/9b0ba020d6bd8faaee1c28f1a0b3ab86e4b753df))

### BREAKING CHANGES

- **@ew-did-registry/jwt:** JWT initialized from Keys and Signer are non-standard ES256K

## [0.6.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.6.1) (2021-10-08)

**Note:** Version bump only for package @ew-did-registry/did-document

# [0.6.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.1...v0.6.0) (2021-10-06)

### Bug Fixes

- **ethers:** updated to ethers version ^5.4.6 ([8eb0648](https://github.com/energywebfoundation/ew-did-registry/commit/8eb06486040f76c36e543ded141bc3b5bb8ad0e8))

### Features

- **ethers packages:** Updating ethers from 5.3.1 to 5.4.0 ([cee0da7](https://github.com/energywebfoundation/ew-did-registry/commit/cee0da757f618f559245d30994fa59ca44b57767))

## [0.5.3](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.3) (2021-10-04)

**Note:** Version bump only for package @ew-did-registry/did-document

## [0.5.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.2) (2021-10-04)

**Note:** Version bump only for package @ew-did-registry/did-document

## [0.5.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.0...v0.5.1) (2021-04-06)

**Note:** Version bump only for package @ew-did-registry/did-document

# [0.5.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.2...v0.5.0) (2021-03-30)

**Note:** Version bump only for package @ew-did-registry/did-document

# [0.4.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.3.0...v0.4.0) (2021-03-22)

**Note:** Version bump only for package @ew-did-registry/did-document

# [0.3.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.2.0...v0.3.0) (2021-03-19)

### Features

- **@ew-did-registry/did-ethr-resolver:** compile in strict mode ([4315227](https://github.com/energywebfoundation/ew-did-registry/commit/4315227d704364211ed66864eac3bc6a84262681))

# 0.2.0 (2021-03-19)

### Bug Fixes

- remove prerelease id ([09d4aec](https://github.com/energywebfoundation/ew-did-registry/commit/09d4aec87b2ad3e960d3907c641d6152c118e68b))
- **@ew-did-registry/did-ethr-resolver:** replace ethers internal imports ([bc03513](https://github.com/energywebfoundation/ew-did-registry/commit/bc0351339984a241ae33173acd5b8af15cc1a1e7))
- **@ew-did-registry/did-ethr-resolver:** wrap read attribute in document ([083642c](https://github.com/energywebfoundation/ew-did-registry/commit/083642cdd052f93cf64009ecbef507c4f0d4ff1a))

### Features

- **@ew-did-registry/did-document:** add readFromBlock ([7b4f857](https://github.com/energywebfoundation/ew-did-registry/commit/7b4f8571e835892a7c686652ff72b9f40c06a161))
- **@ew-did-registry/did-document:** test restore doc from logs ([590e0ef](https://github.com/energywebfoundation/ew-did-registry/commit/590e0efa9d08b433f84fd372e0ab1689ce96a627))
- **@ew-did-registry/did-ethr-resolver:** add documentFromLogs ([aa00834](https://github.com/energywebfoundation/ew-did-registry/commit/aa008349867af4430f9805a1b77d3f22b5d3730b))
- **@ew-did-registry/did-ethr-resolver:** update to return block number ([1f1e7d7](https://github.com/energywebfoundation/ew-did-registry/commit/1f1e7d77a24133f0165dc31e053f1524dcbdeabf))

# 0.1.0-alpha.0 (2021-02-25)

### Bug Fixes

- **@ew-did-registry/did-ethr-resolver:** replace ethers internal imports ([bc03513](https://github.com/energywebfoundation/ew-did-registry/commit/bc0351339984a241ae33173acd5b8af15cc1a1e7))
- **@ew-did-registry/did-ethr-resolver:** wrap read attribute in document ([083642c](https://github.com/energywebfoundation/ew-did-registry/commit/083642cdd052f93cf64009ecbef507c4f0d4ff1a))

### Features

- **@ew-did-registry/did-document:** add readFromBlock ([7b4f857](https://github.com/energywebfoundation/ew-did-registry/commit/7b4f8571e835892a7c686652ff72b9f40c06a161))
- **@ew-did-registry/did-document:** test restore doc from logs ([590e0ef](https://github.com/energywebfoundation/ew-did-registry/commit/590e0efa9d08b433f84fd372e0ab1689ce96a627))
- **@ew-did-registry/did-ethr-resolver:** add documentFromLogs ([aa00834](https://github.com/energywebfoundation/ew-did-registry/commit/aa008349867af4430f9805a1b77d3f22b5d3730b))
- **@ew-did-registry/did-ethr-resolver:** update to return block number ([1f1e7d7](https://github.com/energywebfoundation/ew-did-registry/commit/1f1e7d77a24133f0165dc31e053f1524dcbdeabf))

## [0.0.1-alpha.694.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.877.0...v0.0.1-alpha.694.2) (2021-02-19)

## [0.0.1-alpha.694.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.776.0...v0.0.1-alpha.694.1) (2020-11-17)

**Note:** Version bump only for package @ew-did-registry/did-document
