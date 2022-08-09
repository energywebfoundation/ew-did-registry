# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.7.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.2...v0.7.0) (2022-08-09)


### Bug Fixes

* **@ew-did-registry/credentials-interface:** change status list 2021 entry ([1c815f5](https://github.com/energywebfoundation/ew-did-registry/commit/1c815f550a0b1a5231522d276e5cc6156ae69d99))
* **@ew-did-registry/verification:** join status list errors ([ebcc9b2](https://github.com/energywebfoundation/ew-did-registry/commit/ebcc9b2b96a3261800ec35672419d780961ab1af))
* validate credential status without status list ([4308f21](https://github.com/energywebfoundation/ew-did-registry/commit/4308f21a86ddd543365d9a24f7ffab8903ea0941))


### Features

* **@ew-did-registry/jwt:** verify ES256 ([028fb9c](https://github.com/energywebfoundation/ew-did-registry/commit/028fb9cd9ad5f123ecd47c5842bf8e5d21e2c022))
* **@ew-did-registry/revocation:** verify credential status ([d848ba6](https://github.com/energywebfoundation/ew-did-registry/commit/d848ba60e5bf73ea821c3aa8de1bad9f57bf0d88))
* **build:** config packages webpack ([33ae38d](https://github.com/energywebfoundation/ew-did-registry/commit/33ae38d72027c262c0e80e96c9a7fefc7bb5bd90))
* **build:** polyfill Node.js modules ([42c5e23](https://github.com/energywebfoundation/ew-did-registry/commit/42c5e23d6c8356ec473d2730beeb1d7b8c3208ed))
* **revocation:** remove onchain claim revocation code ([294da8d](https://github.com/energywebfoundation/ew-did-registry/commit/294da8dc58e7f493cd5e9dac332c41b0f7e49ee4))
* **revocation:** update naming convention in context to credentials ([b76c93b](https://github.com/energywebfoundation/ew-did-registry/commit/b76c93bd25238f057504dbf098d68cc10c53e5eb))
* **status-list-entry:** make fetchStatusListCredential public ([2c295a8](https://github.com/energywebfoundation/ew-did-registry/commit/2c295a83070b55b02d53ebe9506d139aaa479f84))


### BREAKING CHANGES

* **@ew-did-registry/jwt:** JWT initialized from Keys and Signer are non-standard ES256K