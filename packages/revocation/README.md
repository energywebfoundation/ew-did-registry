## Revocation Package
Verifiable credential that are issued to a DID should be revocable by the authorised DID. The `Revocation` implementation achieves this requirement for both on-chain roles and off-chain arbitrary verifiable credential.
> The goal of the EW-DID is to support claim issuance and revocation for DIDs on Energy Web Chain. The library uses two separate contracts for revoking on-chain roles and arbitrary verifiable credential respectively. 
> The on-chain role `RevocationRegistry` contract verifies the authorisation of the revoker from the `ClaimManager`, `ERC1056` and `ENSRegistry` contracts deployed on the EW chains. The off-chain verifiable credential `RevocationRegistry` serves a general purpose revocation and relies on the VC presentation between the verifier and the revoker of the claim.

#### Revocation for on-chain role/claim
* **Import the packages**

``` typescript
import { RevocationRegsOnChainAddr as registryAddress, RevocationOnChain } from '@ew-did-registry/revocation';
import { ProviderTypes } from '@ew-did-registry/did-resolver-interface';
```

* **Creating the revocation class instance**

``` typescript  
    let revocationRegistry: RevocationOnChain;
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const revokerKeys = new Keys({
        privateKey: 'c87509a1c067bbde78beb793e6fa76530b6382a4cxxxxx5e4a9ec0a0f44dc0d3' //use a different key
    });
    const providerSettings = {
        type: ProviderTypes.HTTP,
        uriOrInfo: 'https://volta-rpc.energyweb.org',
    };
    const revoker = EwSigner.fromPrivateKey(revokerKeys.privateKey, providerSettings);
    revocationRegistry = new RevocationOnChain(revoker, registryAddress);
```

* **Revoke an on-chain role**

This method requires the role, the subject and the revoker
Returns boolean.
``` typescript
    const role = 'installer.enerygyweb.com'
    const subject = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const revoker = 'did:ethr:0xe1e087aB98798avcf0ka9410FC985E46e28a3948';
    const res = await revocationRegistry.revokeRole(role, subject, revoker);
```

* **Checking if the role is revoked or not**

This method requires role and the subject
Returns boolean
``` typescript
    const role = 'installer.enerygyweb.com'
    const subject = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const res = await revocationRegistry.isRoleRevoked(role, subject);
```

* **Revoke role for multiple DIDs**

This methods requires role and the subjects (array of DIDs)
Returns boolean
``` typescript
    const role = 'installer.enerygyweb.com'
    const subject1 = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const subject2 = 'did:ethr:0xe1e490aB987BEd9AbdEE9410FC985E46e28a3947';
    const subject3 = 'did:ethr:0xe3e457aB987BEd9AbdEE9410FC985E46e34a3947';
    const revoker = 'did:ethr:0xe1e087aB98798avcf0ka9410FC985E46e28a3948';
    const res = await revocationRegistry.revokeRole(role, [subject1, subject2, subject3], revoker);
```

* **Fetching revoker's detail**

This method requires role and the subject
Returns revoker and revocationTimestamp
``` typescript
    const role = 'installer.enerygyweb.com'
    const subject = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const res = await revocationRegistry.getRevocationDetail(role, subject);
```

#### Revocation for off-chain verifiable credential 
* **Import the packages**

``` typescript
import { RevocationRegOffChainAddr as registryAddress, RevocationOffChain } from '@ew-did-registry/revocation';
import { ProviderTypes } from '@ew-did-registry/did-resolver-interface';
```

* **Create the revocation class instance**

``` typescript  
    let revocationRegistry: RevocationOffChain;
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const revokerKeys = new Keys({
        privateKey: 'c87509a1c067bbde78beb793e6fa76530b6382a4cxxxxx5e4a9ec0a0f44dc0d3' //use a different key
    });
    const providerSettings = {
        type: ProviderTypes.HTTP,
        uriOrInfo: 'https://volta-rpc.energyweb.org',
    };
    const revoker = EwSigner.fromPrivateKey(revokerKeys.privateKey, providerSettings);
    revocationRegistry = new RevocationOffChain(revoker, registryAddress);
```

* **Revoke a credential**

This method requires the credential to be revoked
Returns boolean.
``` typescript
    const credential = 'This is a sample credential';
    const res = await revocationRegistry.revokeRole(credential);
```

* **Fetch revocations for a credential**

This method requires credential to fectch it's revocations
Returns array of revokers and revocationTimestamp respectively
``` typescript
    const credential = 'This is a sample credential';
    const res = await revocationRegistry.getRevocations(credential);
```