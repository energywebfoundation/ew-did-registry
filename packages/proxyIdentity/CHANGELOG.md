# Change Log

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.8.0...v0.9.0) (2023-07-20)

### Bug Fixes

- remove identitymanager deploy script ([f23197d](https://github.com/energywebfoundation/ew-did-registry/commit/f23197d10e7e7a13ed9d1fcf1a1dce621d450e42))
- upgrade dependencies ([ae2dcf7](https://github.com/energywebfoundation/ew-did-registry/commit/ae2dcf717068d433c646e519d8e1c989837511c6))

### Features

- **@ew-did-registry/did-ipfs-store:** is pinned when fully replicated ([ccef0e6](https://github.com/energywebfoundation/ew-did-registry/commit/ccef0e600547c5b1496165706c8fb57bde04b9aa))
- **@ew-did-registry/proxyidentity:** check proxied identity ownership ([cf03461](https://github.com/energywebfoundation/ew-did-registry/commit/cf0346169f1d9aeea3755f59fccfe9b2a6ec7a32))
- add ownership transfer script for identitymanager ([775c7ef](https://github.com/energywebfoundation/ew-did-registry/commit/775c7ef437372edd2b46a10dfec7fe86c9095ca4))
- add uups deployment type ([f3a42b0](https://github.com/energywebfoundation/ew-did-registry/commit/f3a42b0f9c0e811a77d86344720caf3f1e321ff5))
- update truffle config to use hdwalletprovider ([8e9f3bf](https://github.com/energywebfoundation/ew-did-registry/commit/8e9f3bf8b9457da0d9c069671c25dd3940be5876))

# [0.8.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.7.0...v0.8.0) (2022-09-29)

### Code Refactoring

- **@ew-did-registry/did-ipfs-store:** change infura ipfs on hosted cluster ([4d5c031](https://github.com/energywebfoundation/ew-did-registry/commit/4d5c031309b5a34bac474c215df83191477495cf))

### BREAKING CHANGES

- **@ew-did-registry/did-ipfs-store:** initializer of did store changed from ipfs node url to ipfs cluster root

# [0.7.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.2...v0.7.0) (2022-08-09)

### Bug Fixes

- fix i and open-zeppelin vulnerabilities ([3dd879e](https://github.com/energywebfoundation/ew-did-registry/commit/3dd879e3b54113ddb075f45afaacf20c169602c7))
- validate credential status without status list ([4308f21](https://github.com/energywebfoundation/ew-did-registry/commit/4308f21a86ddd543365d9a24f7ffab8903ea0941))

### Features

- **@ew-did-registry/jwt:** verify ES256 ([028fb9c](https://github.com/energywebfoundation/ew-did-registry/commit/028fb9cd9ad5f123ecd47c5842bf8e5d21e2c022))
- **build:** config packages webpack ([33ae38d](https://github.com/energywebfoundation/ew-did-registry/commit/33ae38d72027c262c0e80e96c9a7fefc7bb5bd90))
- **build:** polyfill Node.js modules ([42c5e23](https://github.com/energywebfoundation/ew-did-registry/commit/42c5e23d6c8356ec473d2730beeb1d7b8c3208ed))

### BREAKING CHANGES

- **@ew-did-registry/jwt:** JWT initialized from Keys and Signer are non-standard ES256K

## [0.6.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.1...v0.6.2) (2021-10-21)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

## [0.6.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.6.1) (2021-10-08)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

# [0.6.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.1...v0.6.0) (2021-10-06)

### Bug Fixes

- **@ew-did-registry/proxyidenity:** sync change owner ([31fabdc](https://github.com/energywebfoundation/ew-did-registry/commit/31fabdc96cf0b69f06c8090590c861e5ab32029e))
- **@ew-did-registry/proxyidentity:** include validity optionally ([e0bed7f](https://github.com/energywebfoundation/ew-did-registry/commit/e0bed7f52f51b7d1a8ef655130ff19736b16878c))
- **@ew-did-registry/proxyidentity:** unify scripts names ([80fdf25](https://github.com/energywebfoundation/ew-did-registry/commit/80fdf259ded5b9706f0343bb24268a9ad038089a))
- **ethers:** updated to ethers version ^5.4.6 ([8eb0648](https://github.com/energywebfoundation/ew-did-registry/commit/8eb06486040f76c36e543ded141bc3b5bb8ad0e8))
- **offerableIdentityOperator:** params are not array ([a620a8a](https://github.com/energywebfoundation/ew-did-registry/commit/a620a8a97a477bdcd8814d26bb02a7bc4a3f60a4))
- **proxyIdentity:** rename test-rpc script to test ([e990ac5](https://github.com/energywebfoundation/ew-did-registry/commit/e990ac5fb8008923b1f46075dc9b8f9b9dd2fe3d))
- **proxyIdentity:** update openzeppelin to 4.3.1 ([ac2a724](https://github.com/energywebfoundation/ew-did-registry/commit/ac2a724f8d881d86cd2647e5b0307f84c7d0393c))

### Features

- **@energyweb/iam-contracts:** impl IOwned on offerable identity ([aa8551a](https://github.com/energywebfoundation/ew-did-registry/commit/aa8551a4cb819b7028905e43c942ec962bbe4ebd))
- **@ew-did-registry/proxyidentity:** clone from openzeppelin ([717ab04](https://github.com/energywebfoundation/ew-did-registry/commit/717ab04cda609dd02f2bae151b13cfa13faa8cb8))
- **@ew-did-registry/proxyidentity:** proxy call to any contract ([373e242](https://github.com/energywebfoundation/ew-did-registry/commit/373e242f762f3397ffefbbb75ca3f4710a0aa8e6))
- **ethers packages:** Updating ethers from 5.3.1 to 5.4.0 ([cee0da7](https://github.com/energywebfoundation/ew-did-registry/commit/cee0da757f618f559245d30994fa59ca44b57767))

## [0.5.3](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.3) (2021-10-04)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

## [0.5.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.2) (2021-10-04)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

## [0.5.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.0...v0.5.1) (2021-04-06)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

# [0.5.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.2...v0.5.0) (2021-03-30)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

## [0.4.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.1...v0.4.2) (2021-03-25)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

## [0.4.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.0...v0.4.1) (2021-03-25)

**Note:** Version bump only for package @ew-did-registry/proxyidentity

# [0.4.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.3.0...v0.4.0) (2021-03-22)

### Bug Fixes

- **@ew-did-registry/proxyidentity:** require owner to send tx ([73d733c](https://github.com/energywebfoundation/ew-did-registry/commit/73d733cab8df62803ffd451bf3d4913421385304))

### Features

- **@ew-did-registry/proxyidenity:** timestamp in events ([3826a35](https://github.com/energywebfoundation/ew-did-registry/commit/3826a354193da67dc3260a0add7789cfdba02689))
- **@ew-did-registry/proxyidenity:** timestamp in events ([9930171](https://github.com/energywebfoundation/ew-did-registry/commit/99301719f5d98449085735b8cbc374f7bc8e6fdc))
- **@ew-did-registry/proxyidentity:** acknodwledge transfer ([ef3297c](https://github.com/energywebfoundation/ew-did-registry/commit/ef3297c2b9e7ad040cecde4abe6e433985286fba))
- **@ew-did-registry/proxyidentity:** send tx through identity ([55e21e6](https://github.com/energywebfoundation/ew-did-registry/commit/55e21e6b368d536a2cf455726d5f8aaabac7a62d))
- **@ew-did-registry/proxyidentity:** test identity transfer ([6026bc1](https://github.com/energywebfoundation/ew-did-registry/commit/6026bc18c1e60b52194ceadaa8205a16d3186346))
- **@ew-did-registry/proxyidentity:** test notify on offer ([3870341](https://github.com/energywebfoundation/ew-did-registry/commit/38703415fd8f29a6d9c0d28019948f10da5cce23))
- **@ew-did-registry/proxyidentity:** test notify on reject ([189c76a](https://github.com/energywebfoundation/ew-did-registry/commit/189c76a570139b8e87e33f9c4b514064d15ae9ac))
- **@ew-did-registry/proxyidentity:** test notify on transfer ([25c092b](https://github.com/energywebfoundation/ew-did-registry/commit/25c092b1eebc1680801df25e8832cabeedbf1a30))

# [0.3.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.2.0...v0.3.0) (2021-03-19)

### Features

- **@ew-did-registry/did-ethr-resolver:** compile in strict mode ([4315227](https://github.com/energywebfoundation/ew-did-registry/commit/4315227d704364211ed66864eac3bc6a84262681))

# 0.2.0 (2021-03-19)

### Bug Fixes

- remove prerelease id ([09d4aec](https://github.com/energywebfoundation/ew-did-registry/commit/09d4aec87b2ad3e960d3907c641d6152c118e68b))
- **@ew-did-registry/did-ethr-resolver:** replace ethers internal imports ([bc03513](https://github.com/energywebfoundation/ew-did-registry/commit/bc0351339984a241ae33173acd5b8af15cc1a1e7))

### Features

- rm web3 from proxyIdentity ([624a0e5](https://github.com/energywebfoundation/ew-did-registry/commit/624a0e5f0adcc261fe68d9f7b11f66dc33bc61ff))

# 0.1.0-alpha.0 (2021-02-25)

### Bug Fixes

- **@ew-did-registry/did-ethr-resolver:** replace ethers internal imports ([bc03513](https://github.com/energywebfoundation/ew-did-registry/commit/bc0351339984a241ae33173acd5b8af15cc1a1e7))

### Features

- rm web3 from proxyIdentity ([624a0e5](https://github.com/energywebfoundation/ew-did-registry/commit/624a0e5f0adcc261fe68d9f7b11f66dc33bc61ff))

## [0.0.1-alpha.694.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.877.0...v0.0.1-alpha.694.2) (2021-02-19)

## [0.0.1-alpha.694.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.776.0...v0.0.1-alpha.694.1) (2020-11-17)

**Note:** Version bump only for package @ew-did-registry/proxyidentity
