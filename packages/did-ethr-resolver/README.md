## Resolver Package
### 1056 Resolver
Resolver is the implementation of ERC1056 standard. It only exposes the Read functionality of the DID document. The class is implemented with caching. Recurring calls will execute 
significantly faster.
> The design goal of EW DID is to support different DID methods on Energy Web Chain. The resolver currently has the support for ERC1056 standard (`ethr` DID method). In future, we will have support for ERC725 standard which enables `erc725` DID method.

* **Importing required modules**

``` typescript
import { Resolver, DelegateTypes } from '@ew-did-registry/did-resolver';
```

* **Reading the DID Document for particular id**

``` typescript  
    const resolver = new Resolver();
    const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
```

* **Reading the current owner of the did**

This method doesn't require full document fetching.
Returns did of the current owner.
``` typescript
    const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const owner = await resolver.identityOwner(did);
```

* **Checking if delegate is present in the DID Document**

This read doesn't require full document fetching.
Returns boolean if the delegate is present.
``` typescript
    const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDelegate = 'did:ewc:0xe2e457aods7BEd9AbdEE9410xt985E46e28a3947';
    const validDelegate = await resolver.validDelegate(did, DelegateTypes.verification, didDelegate);
```