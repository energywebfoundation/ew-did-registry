# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.7.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.2...v0.7.0) (2022-08-09)


### Bug Fixes

* **@ew-did-registry/claims:** mv sjcl types to dev deps ([866ddbf](https://github.com/energywebfoundation/ew-did-registry/commit/866ddbf9fd11a4dbeff9dfb1b8e23410f26fd2a9))
* **@ew-did-registry/credentials-governance:** add vprequest to exchange selection ([be00f68](https://github.com/energywebfoundation/ew-did-registry/commit/be00f680d841975d2c4b950d88ee77eedf02a10d))
* **@ew-did-registry/credentials-interface:** change status list 2021 entry ([1c815f5](https://github.com/energywebfoundation/ew-did-registry/commit/1c815f550a0b1a5231522d276e5cc6156ae69d99))
* **@ew-did-registry/credentials-interface:** presentation definitionf from pex ([7992b92](https://github.com/energywebfoundation/ew-did-registry/commit/7992b92bd0cb66f57a62750840875ea9fd5db284))
* **@ew-did-registry/jwt:** replace deep import from ([10f155b](https://github.com/energywebfoundation/ew-did-registry/commit/10f155b5b3cf4e8446236c4a0788e76c9b0eeaa4))
* **@ew-did-registry/verification:** join status list errors ([ebcc9b2](https://github.com/energywebfoundation/ew-did-registry/commit/ebcc9b2b96a3261800ec35672419d780961ab1af))
* add sjcl types to dependencies ([994a040](https://github.com/energywebfoundation/ew-did-registry/commit/994a040b2daf5fb0283ce238ebd6e8fb347993d9))
* credential extends type ([bca04ff](https://github.com/energywebfoundation/ew-did-registry/commit/bca04ff681ab57b0d063f2e9fea53b8f1b17e7e7))
* **deploy.yml:** preventing double run ([#348](https://github.com/energywebfoundation/ew-did-registry/issues/348)) ([eb2ebbc](https://github.com/energywebfoundation/ew-did-registry/commit/eb2ebbc922a6aad792018a1db14c8230de190748))
* fix i and open-zeppelin vulnerabilities ([3dd879e](https://github.com/energywebfoundation/ew-did-registry/commit/3dd879e3b54113ddb075f45afaacf20c169602c7))
* **GH_Action:** setting permissions on GITHUB_TOKEN to replace Personal Access Token usage ([#345](https://github.com/energywebfoundation/ew-did-registry/issues/345)) ([57e0fe5](https://github.com/energywebfoundation/ew-did-registry/commit/57e0fe57816101797a8623b09dd9a8fb675caff5))
* **jwy:** remove fractional digits from `exp` ([7e183b8](https://github.com/energywebfoundation/ew-did-registry/commit/7e183b884cc9f012550fbbe6622bea55dc7f02f5))
* **proofVerifier:** using addressOf() to get address ([b19681f](https://github.com/energywebfoundation/ew-did-registry/commit/b19681fc24074679abb9508db15e41c34448fda2))
* remove support for DWN service endpoints ([994bb6f](https://github.com/energywebfoundation/ew-did-registry/commit/994bb6f22f0f7746a96edea52d57628828ed0f74))
* **serviceEndpoint:** Service should have service endpoint ([67db59a](https://github.com/energywebfoundation/ew-did-registry/commit/67db59ac568ef87a1d2320cc1fd5957b9d81d93c))
* **types:** update pex types ([83b3eb6](https://github.com/energywebfoundation/ew-did-registry/commit/83b3eb6cf8669b5578c85fa93462b0ff0a3ef8ba))
* validate credential status without status list ([4308f21](https://github.com/energywebfoundation/ew-did-registry/commit/4308f21a86ddd543365d9a24f7ffab8903ea0941))
* **wrapDidDocument:** actually make copy ([68529df](https://github.com/energywebfoundation/ew-did-registry/commit/68529df0a3d8ad209873b40c73e7e13a4e79a629))


### Features

* **@ew-did-registry/claims:** verify assertion by address ([bd38798](https://github.com/energywebfoundation/ew-did-registry/commit/bd387982a8cd094ac278828d819c53205ca3042e))
* **@ew-did-registry/credentials-interface:** add exchange types ([0083119](https://github.com/energywebfoundation/ew-did-registry/commit/0083119d1e22bbb157a553ef0aef83006617d730))
* **@ew-did-registry/credentials-interface:** status list types ([b902b07](https://github.com/energywebfoundation/ew-did-registry/commit/b902b07edba1dd3bdd9df124143409f71914399b))
* **@ew-did-registry/jwt:** verify ES256 ([028fb9c](https://github.com/energywebfoundation/ew-did-registry/commit/028fb9cd9ad5f123ecd47c5842bf8e5d21e2c022))
* **@ew-did-registry/revocation:** verify credential status ([d848ba6](https://github.com/energywebfoundation/ew-did-registry/commit/d848ba60e5bf73ea821c3aa8de1bad9f57bf0d88))
* add exchange continue types ([dcbe407](https://github.com/energywebfoundation/ew-did-registry/commit/dcbe407556bde773bd0e26e785a68e16b71345f7))
* **build:** config packages webpack ([33ae38d](https://github.com/energywebfoundation/ew-did-registry/commit/33ae38d72027c262c0e80e96c9a7fefc7bb5bd90))
* **build:** polyfill Node.js modules ([42c5e23](https://github.com/energywebfoundation/ew-did-registry/commit/42c5e23d6c8356ec473d2730beeb1d7b8c3208ed))
* **build:** separate node and web configs ([aa14bd3](https://github.com/energywebfoundation/ew-did-registry/commit/aa14bd38b4eac92dfa5cf3c5aa574c17bfcd0eac))
* **claim:** add credentialstatus prop to ipublicclaim ([aee7959](https://github.com/energywebfoundation/ew-did-registry/commit/aee7959c294084d3e1832be09cdb63cdbb163ed0))
* **claim:** add expiration timestamp to public claims ([69b56a4](https://github.com/energywebfoundation/ew-did-registry/commit/69b56a4a82e6eafbfce3dd36f9663cd63bd97dfe))
* **credentials-interface:** add `credentials-interface` package ([9003e31](https://github.com/energywebfoundation/ew-did-registry/commit/9003e3176355ee88f72a0b7723c6146ef2ac46e8))
* **credentials-interface:** add exchange type validation ([a70a57c](https://github.com/energywebfoundation/ew-did-registry/commit/a70a57cc52d2a6e9eda46095f9f17afcd350ecca))
* **credentials-interface:** export utils ([1481a5b](https://github.com/energywebfoundation/ew-did-registry/commit/1481a5b236f6a23cfbb5aaec6a74de5f748317a4))
* **did:** updatePublicKey and updateDelegate in did ([9b0ba02](https://github.com/energywebfoundation/ew-did-registry/commit/9b0ba020d6bd8faaee1c28f1a0b3ab86e4b753df))
* **jwt:** add jwt expiration ([4ee1c65](https://github.com/energywebfoundation/ew-did-registry/commit/4ee1c65fac8e74e834f5fc12ecb799607f7ab817))
* rename vc api exchange ([a36dc3c](https://github.com/energywebfoundation/ew-did-registry/commit/a36dc3cbaee1488bc7e6fde96b3e2ecb818e2601))
* **revocation:** add cred status to signed data ([eccad52](https://github.com/energywebfoundation/ew-did-registry/commit/eccad522b083ea80d527ebec065e4815224750b7))
* **revocation:** remove not null check ([9253447](https://github.com/energywebfoundation/ew-did-registry/commit/925344737b67935635b119107d4ae0a59f156b2f))
* **revocation:** remove onchain claim revocation code ([294da8d](https://github.com/energywebfoundation/ew-did-registry/commit/294da8dc58e7f493cd5e9dac332c41b0f7e49ee4))
* **revocation:** update naming convention in context to credentials ([b76c93b](https://github.com/energywebfoundation/ew-did-registry/commit/b76c93bd25238f057504dbf098d68cc10c53e5eb))
* **status-list-entry:** make fetchStatusListCredential public ([2c295a8](https://github.com/energywebfoundation/ew-did-registry/commit/2c295a83070b55b02d53ebe9506d139aaa479f84))
* update `isValidErc1056` to accept DID address with chain name ([90b1c59](https://github.com/energywebfoundation/ew-did-registry/commit/90b1c59c76ad7e0528e969723b960fe0a4d1c9d8))


### BREAKING CHANGES

* **@ew-did-registry/jwt:** JWT initialized from Keys and Signer are non-standard ES256K





## [0.6.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.1...v0.6.2) (2021-10-21)


### Bug Fixes

* **deploy.yml:** removing useless rights and resetting Token on merging ([9f73032](https://github.com/energywebfoundation/ew-did-registry/commit/9f73032d63afbc68615ac49bdc70a494a95e8c8e))





## [0.6.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.6.1) (2021-10-08)

**Note:** Version bump only for package ew-did-registry





# [0.6.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.1...v0.6.0) (2021-10-06)


### Bug Fixes

* **@ew-did-registry/claims:** skip verify claim requester ([db9d414](https://github.com/energywebfoundation/ew-did-registry/commit/db9d414a730dd78a568c6c286f84a5fc9508ad58))
* **@ew-did-registry/did-ethr-resolver:** identity tx by name ([79194f7](https://github.com/energywebfoundation/ew-did-registry/commit/79194f703612f037f29c5b2a694041bcb7036c49))
* **@ew-did-registry/proxyidenity:** sync change owner ([31fabdc](https://github.com/energywebfoundation/ew-did-registry/commit/31fabdc96cf0b69f06c8090590c861e5ab32029e))
* **@ew-did-registry/proxyidentity:** include validity optionally ([e0bed7f](https://github.com/energywebfoundation/ew-did-registry/commit/e0bed7f52f51b7d1a8ef655130ff19736b16878c))
* **@ew-did-registry/proxyidentity:** unify scripts names ([80fdf25](https://github.com/energywebfoundation/ew-did-registry/commit/80fdf259ded5b9706f0343bb24268a9ad038089a))
* **deploy.yml:** fix deployment order ([60c0a32](https://github.com/energywebfoundation/ew-did-registry/commit/60c0a32fce06104184d358a4083fc99365802462))
* **deploy.yml:** fix indentation ([acd98d4](https://github.com/energywebfoundation/ew-did-registry/commit/acd98d4ac33f86f442a498d5b8c1e442893e551c))
* **did-ethr-resolver:** removing caching from resolver.ts ([c90168f](https://github.com/energywebfoundation/ew-did-registry/commit/c90168f407e089fe37bbcb39435b1c26b8e46ae8))
* **ethers:** updated to ethers version ^5.4.6 ([8eb0648](https://github.com/energywebfoundation/ew-did-registry/commit/8eb06486040f76c36e543ded141bc3b5bb8ad0e8))
* **github action:** update token name ([204ede8](https://github.com/energywebfoundation/ew-did-registry/commit/204ede8ccad200d88e3c95dd04fe29e7908b1af7))
* **interfaces:** remove the duplicated IdentityOwner from interfaces ([#318](https://github.com/energywebfoundation/ew-did-registry/issues/318)) ([bcba5f5](https://github.com/energywebfoundation/ew-did-registry/commit/bcba5f5344eddf8b05dc5f500c026f20f14c860c))
* **offerableIdentityOperator:** params are not array ([a620a8a](https://github.com/energywebfoundation/ew-did-registry/commit/a620a8a97a477bdcd8814d26bb02a7bc4a3f60a4))
* **Operator:** Resolver base class was always using default provider ([#327](https://github.com/energywebfoundation/ew-did-registry/issues/327)) ([4e01826](https://github.com/energywebfoundation/ew-did-registry/commit/4e0182687ab0e9b441898fc8162101c9648d2471))
* **packages:** restoring package-lock ([bb66c8b](https://github.com/energywebfoundation/ew-did-registry/commit/bb66c8b8b6d37f1b9631271758dadcfde363e30b))
* **proxyIdentity:** rename test-rpc script to test ([e990ac5](https://github.com/energywebfoundation/ew-did-registry/commit/e990ac5fb8008923b1f46075dc9b8f9b9dd2fe3d))
* **proxyIdentity:** update openzeppelin to 4.3.1 ([ac2a724](https://github.com/energywebfoundation/ew-did-registry/commit/ac2a724f8d881d86cd2647e5b0307f84c7d0393c))
* **resolver:** readOnwerPubKey() handle key with 0x ([b337a8b](https://github.com/energywebfoundation/ew-did-registry/commit/b337a8ba27f150eb0c19ae5cb623ff942819d809))
* compile to es6 ([8d85582](https://github.com/energywebfoundation/ew-did-registry/commit/8d85582c6c9342b1bd6564a437d78ef0c4cb3977))


### Features

* **@energyweb/iam-contracts:** impl IOwned on offerable identity ([aa8551a](https://github.com/energywebfoundation/ew-did-registry/commit/aa8551a4cb819b7028905e43c942ec962bbe4ebd))
* **@ew-did-registry/proxyidentity:** clone from openzeppelin ([717ab04](https://github.com/energywebfoundation/ew-did-registry/commit/717ab04cda609dd02f2bae151b13cfa13faa8cb8))
* **@ew-did-registry/proxyidentity:** proxy call to any contract ([373e242](https://github.com/energywebfoundation/ew-did-registry/commit/373e242f762f3397ffefbbb75ca3f4710a0aa8e6))
* **eslint:** setting eslint ([0e77331](https://github.com/energywebfoundation/ew-did-registry/commit/0e773310ca665aac97d32adb5ac6bd453632bdde))
* **eslint:** setting eslint ([f9626e0](https://github.com/energywebfoundation/ew-did-registry/commit/f9626e002a47f15df61a4d7290218026bdcf57cf))
* **ethers packages:** Updating ethers from 5.3.1 to 5.4.0 ([cee0da7](https://github.com/energywebfoundation/ew-did-registry/commit/cee0da757f618f559245d30994fa59ca44b57767))
* **EwJsonRpcSigner:** construct from ethers provider ([3705c4c](https://github.com/energywebfoundation/ew-did-registry/commit/3705c4cfcada283c0d5fe5c2521ad9c39be0d595))
* **EwSigner:** add fromEthersSigner ([#328](https://github.com/energywebfoundation/ew-did-registry/issues/328)) ([921886b](https://github.com/energywebfoundation/ew-did-registry/commit/921886becbf8bd40e5181c269389b2e64e977903))
* **GHA ctions:** setting semantic release to use ([f685f2d](https://github.com/energywebfoundation/ew-did-registry/commit/f685f2da2d96d7399dcb413049ce4cb991992c9c))





## [0.5.3](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.3) (2021-10-04)

**Note:** Version bump only for package ew-did-registry





## [0.5.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.6.0...v0.5.2) (2021-10-04)

**Note:** Version bump only for package ew-did-registry





## [0.5.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.5.0...v0.5.1) (2021-04-06)

**Note:** Version bump only for package ew-did-registry





# [0.5.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.2...v0.5.0) (2021-03-30)


### Features

* **@ew-did-registry/did-ethr-resolver:** reuse highlevel funcs ([e5d8ed3](https://github.com/energywebfoundation/ew-did-registry/commit/e5d8ed3b670ddc56ee002b2901722acc820a1446))





## [0.4.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.1...v0.4.2) (2021-03-25)

**Note:** Version bump only for package ew-did-registry





## [0.4.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.4.0...v0.4.1) (2021-03-25)

**Note:** Version bump only for package ew-did-registry





# [0.4.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.3.0...v0.4.0) (2021-03-22)


### Bug Fixes

* **@ew-did-registry/proxyidentity:** require owner to send tx ([73d733c](https://github.com/energywebfoundation/ew-did-registry/commit/73d733cab8df62803ffd451bf3d4913421385304))


### Features

* **@ew-did-registry/proxyidenity:** timestamp in events ([3826a35](https://github.com/energywebfoundation/ew-did-registry/commit/3826a354193da67dc3260a0add7789cfdba02689))
* **@ew-did-registry/proxyidenity:** timestamp in events ([9930171](https://github.com/energywebfoundation/ew-did-registry/commit/99301719f5d98449085735b8cbc374f7bc8e6fdc))
* **@ew-did-registry/proxyidentity:** acknodwledge transfer ([ef3297c](https://github.com/energywebfoundation/ew-did-registry/commit/ef3297c2b9e7ad040cecde4abe6e433985286fba))
* **@ew-did-registry/proxyidentity:** send tx through identity ([55e21e6](https://github.com/energywebfoundation/ew-did-registry/commit/55e21e6b368d536a2cf455726d5f8aaabac7a62d))
* **@ew-did-registry/proxyidentity:** test identity transfer ([6026bc1](https://github.com/energywebfoundation/ew-did-registry/commit/6026bc18c1e60b52194ceadaa8205a16d3186346))
* **@ew-did-registry/proxyidentity:** test notify on offer ([3870341](https://github.com/energywebfoundation/ew-did-registry/commit/38703415fd8f29a6d9c0d28019948f10da5cce23))
* **@ew-did-registry/proxyidentity:** test notify on reject ([189c76a](https://github.com/energywebfoundation/ew-did-registry/commit/189c76a570139b8e87e33f9c4b514064d15ae9ac))
* **@ew-did-registry/proxyidentity:** test notify on transfer ([25c092b](https://github.com/energywebfoundation/ew-did-registry/commit/25c092b1eebc1680801df25e8832cabeedbf1a30))





# [0.3.0](https://github.com/energywebfoundation/ew-did-registry/compare/v0.2.0...v0.3.0) (2021-03-19)


### Bug Fixes

* **@ew-did-registry/claims:** alias sjcl-complete ([74230c5](https://github.com/energywebfoundation/ew-did-registry/commit/74230c54870882bf447f0aa81a62a6ca64b87324))
* **@ew-did-registry/did-resolver-interface:** add undef to optional props ([b6d8d2b](https://github.com/energywebfoundation/ew-did-registry/commit/b6d8d2b6cd5d2bfbdc6ba8d69986a0f40f7c8829))
* **@ew-did-registry/jwt:** add jsonwebtoken types ([9698864](https://github.com/energywebfoundation/ew-did-registry/commit/969886441910705a2bf9ccead6bf31dbfe8f12dc))


### Features

* **@ew-did-registry/did-ethr-resolver:** compile in strict mode ([4315227](https://github.com/energywebfoundation/ew-did-registry/commit/4315227d704364211ed66864eac3bc6a84262681))





# 0.2.0 (2021-03-19)


### Bug Fixes

* remove prerelease id ([09d4aec](https://github.com/energywebfoundation/ew-did-registry/commit/09d4aec87b2ad3e960d3907c641d6152c118e68b))
* **@ew-did-registry/did-ethr-resolver:** replace ethers internal imports ([bc03513](https://github.com/energywebfoundation/ew-did-registry/commit/bc0351339984a241ae33173acd5b8af15cc1a1e7))
* add package-locks to git ([2ae5beb](https://github.com/energywebfoundation/ew-did-registry/commit/2ae5bebee29c4995efb1b37d37cc9e4b3946c601))
* **@ew-did-registry/did-ethr-resolver:** update with zero validity ([7381837](https://github.com/energywebfoundation/ew-did-registry/commit/7381837efee63a97ad1b790a90389b2ceb7a649c))
* **@ew-did-registry/did-ethr-resolver:** wrap read attribute in document ([083642c](https://github.com/energywebfoundation/ew-did-registry/commit/083642cdd052f93cf64009ecbef507c4f0d4ff1a))


### Features

* replace web3 in resolver ([77759b6](https://github.com/energywebfoundation/ew-did-registry/commit/77759b681e9a4937097db34e6e01ba2a48a15f80))
* rm web3 from proxyIdentity ([624a0e5](https://github.com/energywebfoundation/ew-did-registry/commit/624a0e5f0adcc261fe68d9f7b11f66dc33bc61ff))
* **@ew-did-registry/did-document:** add readFromBlock ([7b4f857](https://github.com/energywebfoundation/ew-did-registry/commit/7b4f8571e835892a7c686652ff72b9f40c06a161))
* **@ew-did-registry/did-document:** test restore doc from logs ([590e0ef](https://github.com/energywebfoundation/ew-did-registry/commit/590e0efa9d08b433f84fd372e0ab1689ce96a627))
* **@ew-did-registry/did-ethr-resolver:** add documentFromLogs ([aa00834](https://github.com/energywebfoundation/ew-did-registry/commit/aa008349867af4430f9805a1b77d3f22b5d3730b))
* **@ew-did-registry/did-ethr-resolver:** add readFromBlock ([faffd31](https://github.com/energywebfoundation/ew-did-registry/commit/faffd316d655d730db1f61348fa643e7f9e8af4d))
* **@ew-did-registry/did-ethr-resolver:** update to return block number ([1f1e7d7](https://github.com/energywebfoundation/ew-did-registry/commit/1f1e7d77a24133f0165dc31e053f1524dcbdeabf))





# 0.1.0-alpha.0 (2021-02-25)


### Bug Fixes

* **@ew-did-registry/did-ethr-resolver:** replace ethers internal imports ([bc03513](https://github.com/energywebfoundation/ew-did-registry/commit/bc0351339984a241ae33173acd5b8af15cc1a1e7))
* add package-locks to git ([2ae5beb](https://github.com/energywebfoundation/ew-did-registry/commit/2ae5bebee29c4995efb1b37d37cc9e4b3946c601))
* **@ew-did-registry/did-ethr-resolver:** update with zero validity ([7381837](https://github.com/energywebfoundation/ew-did-registry/commit/7381837efee63a97ad1b790a90389b2ceb7a649c))
* **@ew-did-registry/did-ethr-resolver:** wrap read attribute in document ([083642c](https://github.com/energywebfoundation/ew-did-registry/commit/083642cdd052f93cf64009ecbef507c4f0d4ff1a))


### Features

* replace web3 in resolver ([77759b6](https://github.com/energywebfoundation/ew-did-registry/commit/77759b681e9a4937097db34e6e01ba2a48a15f80))
* rm web3 from proxyIdentity ([624a0e5](https://github.com/energywebfoundation/ew-did-registry/commit/624a0e5f0adcc261fe68d9f7b11f66dc33bc61ff))
* **@ew-did-registry/did-document:** add readFromBlock ([7b4f857](https://github.com/energywebfoundation/ew-did-registry/commit/7b4f8571e835892a7c686652ff72b9f40c06a161))
* **@ew-did-registry/did-document:** test restore doc from logs ([590e0ef](https://github.com/energywebfoundation/ew-did-registry/commit/590e0efa9d08b433f84fd372e0ab1689ce96a627))
* **@ew-did-registry/did-ethr-resolver:** add documentFromLogs ([aa00834](https://github.com/energywebfoundation/ew-did-registry/commit/aa008349867af4430f9805a1b77d3f22b5d3730b))
* **@ew-did-registry/did-ethr-resolver:** add readFromBlock ([faffd31](https://github.com/energywebfoundation/ew-did-registry/commit/faffd316d655d730db1f61348fa643e7f9e8af4d))
* **@ew-did-registry/did-ethr-resolver:** update to return block number ([1f1e7d7](https://github.com/energywebfoundation/ew-did-registry/commit/1f1e7d77a24133f0165dc31e053f1524dcbdeabf))





## [0.0.1-alpha.694.2](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.877.0...v0.0.1-alpha.694.2) (2021-02-19)



## [0.0.1-alpha.694.1](https://github.com/energywebfoundation/ew-did-registry/compare/v0.0.1-alpha.776.0...v0.0.1-alpha.694.1) (2020-11-17)

**Note:** Version bump only for package ew-did-registry





# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to
