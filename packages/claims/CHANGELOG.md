# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.8.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.7.0...v0.8.0) (2022-09-29)


### Code Refactoring

* **@ew-did-registry/did-ipfs-store:** change infura ipfs on hosted cluster ([4d5c031](https://github.com/energywebfoundation/ew-did-registry/commit/4d5c031309b5a34bac474c215df83191477495cf))


### Features

* **expiration:** add exp prop to ipublicclaim ([f4ed866](https://github.com/energywebfoundation/ew-did-registry/commit/f4ed8661f8e0dc0cb09eb64499769cd73421f9a3))
* **expiration:** add exp to public claim before signing ([3df553e](https://github.com/energywebfoundation/ew-did-registry/commit/3df553e91cc4b9af09cfcc4ce8613470e27fe22d))


### BREAKING CHANGES

* **@ew-did-registry/did-ipfs-store:** initializer of did store changed from ipfs node url to ipfs cluster root





# [0.7.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.2...v0.7.0) (2022-08-09)


### Bug Fixes

* **@ew-did-registry/claims:** mv sjcl types to dev deps ([866ddbf](https://github.com/energywebfoundation/ew-did-registry/commit/866ddbf9fd11a4dbeff9dfb1b8e23410f26fd2a9))
* add sjcl types to dependencies ([994a040](https://github.com/energywebfoundation/ew-did-registry/commit/994a040b2daf5fb0283ce238ebd6e8fb347993d9))
* **proofVerifier:** using addressOf() to get address ([b19681f](https://github.com/energywebfoundation/ew-did-registry/commit/b19681fc24074679abb9508db15e41c34448fda2))
* validate credential status without status list ([4308f21](https://github.com/energywebfoundation/ew-did-registry/commit/4308f21a86ddd543365d9a24f7ffab8903ea0941))


### Features

* **@ew-did-registry/claims:** verify assertion by address ([bd38798](https://github.com/energywebfoundation/ew-did-registry/commit/bd387982a8cd094ac278828d819c53205ca3042e))
* **@ew-did-registry/jwt:** verify ES256 ([028fb9c](https://github.com/energywebfoundation/ew-did-registry/commit/028fb9cd9ad5f123ecd47c5842bf8e5d21e2c022))
* **build:** config packages webpack ([33ae38d](https://github.com/energywebfoundation/ew-did-registry/commit/33ae38d72027c262c0e80e96c9a7fefc7bb5bd90))
* **build:** polyfill Node.js modules ([42c5e23](https://github.com/energywebfoundation/ew-did-registry/commit/42c5e23d6c8356ec473d2730beeb1d7b8c3208ed))
* **claim:** add credentialstatus prop to ipublicclaim ([aee7959](https://github.com/energywebfoundation/ew-did-registry/commit/aee7959c294084d3e1832be09cdb63cdbb163ed0))
* **claim:** add expiration timestamp to public claims ([69b56a4](https://github.com/energywebfoundation/ew-did-registry/commit/69b56a4a82e6eafbfce3dd36f9663cd63bd97dfe))
* **credentials-interface:** add `credentials-interface` package ([9003e31](https://github.com/energywebfoundation/ew-did-registry/commit/9003e3176355ee88f72a0b7723c6146ef2ac46e8))
* **revocation:** add cred status to signed data ([eccad52](https://github.com/energywebfoundation/ew-did-registry/commit/eccad522b083ea80d527ebec065e4815224750b7))
* **revocation:** remove not null check ([9253447](https://github.com/energywebfoundation/ew-did-registry/commit/925344737b67935635b119107d4ae0a59f156b2f))


### BREAKING CHANGES

* **@ew-did-registry/jwt:** JWT initialized from Keys and Signer are non-standard ES256K





## [0.6.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.6.1) (2021-10-08)

**Note:** Version bump only for package @ew-did-registry/claims





# [0.6.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.1...v0.6.0) (2021-10-06)


### Bug Fixes

* **@ew-did-registry/claims:** skip verify claim requester ([db9d414](https://github.com/energywebfoundation/ew-did-registry/commit/db9d414a730dd78a568c6c286f84a5fc9508ad58))
* **resolver:** readOnwerPubKey() handle key with 0x ([b337a8b](https://github.com/energywebfoundation/ew-did-registry/commit/b337a8ba27f150eb0c19ae5cb623ff942819d809))





## [0.5.3](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.3) (2021-10-04)

**Note:** Version bump only for package @ew-did-registry/claims





## [0.5.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.2) (2021-10-04)

**Note:** Version bump only for package @ew-did-registry/claims





## [0.5.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.0...v0.5.1) (2021-04-06)

**Note:** Version bump only for package @ew-did-registry/claims





# [0.5.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.2...v0.5.0) (2021-03-30)

**Note:** Version bump only for package @ew-did-registry/claims





# [0.4.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.3.0...v0.4.0) (2021-03-22)


### Features

* **@ew-did-registry/proxyidenity:** timestamp in events ([3826a35](https://github.com/energywebfoundation/ew-did-registry/commit/3826a354193da67dc3260a0add7789cfdba02689))





# [0.3.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.2.0...v0.3.0) (2021-03-19)


### Bug Fixes

* **@ew-did-registry/claims:** alias sjcl-complete ([74230c5](https://github.com/energywebfoundation/ew-did-registry/commit/74230c54870882bf447f0aa81a62a6ca64b87324))


### Features

* **@ew-did-registry/did-ethr-resolver:** compile in strict mode ([4315227](https://github.com/energywebfoundation/ew-did-registry/commit/4315227d704364211ed66864eac3bc6a84262681))





# 0.2.0 (2021-03-19)


### Bug Fixes

* remove prerelease id ([09d4aec](https://github.com/energywebfoundation/ew-did-registry/commit/09d4aec87b2ad3e960d3907c641d6152c118e68b))
* **@ew-did-registry/did-ethr-resolver:** wrap read attribute in document ([083642c](https://github.com/energywebfoundation/ew-did-registry/commit/083642cdd052f93cf64009ecbef507c4f0d4ff1a))





# 0.1.0-alpha.0 (2021-02-25)


### Bug Fixes

* **@ew-did-registry/did-ethr-resolver:** wrap read attribute in document ([083642c](https://github.com/energywebfoundation/ew-did-registry/commit/083642cdd052f93cf64009ecbef507c4f0d4ff1a))





## [0.0.1-alpha.694.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.877.0...v0.0.1-alpha.694.2) (2021-02-19)



## [0.0.1-alpha.694.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.776.0...v0.0.1-alpha.694.1) (2020-11-17)

**Note:** Version bump only for package @ew-did-registry/claims
