## DID Resolver Interface
EW-DID library has a design goal to support different DID methods. `did-document` allows management of keys, authorisation, delegation and service endpoints in standardised way. In the practical scenario, the CRUD behaviour of the `did-document` needs to be specific to the DID method's underlying implementation. EW-DID aims to handle this through the DID method specific resolver implementation. 

`did-resolver-interface` defines the contract required for CRUD behaviour of the `did-document`. [did-ethr-resolver](/packages/did-ethr-resolver) provides a reference implementation of ERC 1056 standard.

### Class Diagram
[![](https://mermaid.ink/img/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cbmNsYXNzIElSZXNvbHZlcntcbiAgICA8PGludGVyZmFjZT4-XG4gICAgcmVhZCgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5jbGFzcyBJT3BlcmF0b3J7XG4gICAgPDxpbnRlcmZhY2U-PlxuICAgIGNyZWF0ZSgpXG4gICAgdXBkYXRlKClcbiAgICBkZWFjdGl2YXRlKClcbiAgICByZXZva2VEZWxlZ2F0ZSgpXG4gICAgcmV2b2tlQXR0cmlidXRlKClcbn1cblxuY2xhc3MgRVJDMTA1NlxuXG5jbGFzcyBFUkMxMDU2T3BlcmF0b3JcblxuY2xhc3MgRVJDNzI1XG5cbmNsYXNzIEVSQzcyNU9wZXJhdG9yXG5cbmNsYXNzIE15TmV3TWV0aG9kXG5jbGFzcyBNeU5ld01ldGhvZE9wZXJhdG9yXG5JUmVzb2x2ZXIgPHwtLSBJT3BlcmF0b3JcblxuSU9wZXJhdG9yIDx8Li4gRVJDMTA1Nk9wZXJhdG9yXG5JT3BlcmF0b3IgPHwuLiBFUkM3MjVPcGVyYXRvclxuSU9wZXJhdG9yIDx8Li4gTXlOZXdNZXRob2RPcGVyYXRvclxuXG5JUmVzb2x2ZXIgPHwuLiBFUkMxMDU2XG5JUmVzb2x2ZXIgPHwuLiBFUkM3MjVcbklSZXNvbHZlciA8fC4uIE15TmV3TWV0aG9kXG5cbkVSQzEwNTYgPHwtLSBFUkMxMDU2T3BlcmF0b3JcbkVSQzcyNSA8fC0tIEVSQzcyNU9wZXJhdG9yXG5NeU5ld01ldGhvZCA8fC0tIE15TmV3TWV0aG9kT3BlcmF0b3JcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In19)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cbmNsYXNzIElSZXNvbHZlcntcbiAgICA8PGludGVyZmFjZT4-XG4gICAgcmVhZCgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5jbGFzcyBJT3BlcmF0b3J7XG4gICAgPDxpbnRlcmZhY2U-PlxuICAgIGNyZWF0ZSgpXG4gICAgdXBkYXRlKClcbiAgICBkZWFjdGl2YXRlKClcbiAgICByZXZva2VEZWxlZ2F0ZSgpXG4gICAgcmV2b2tlQXR0cmlidXRlKClcbn1cblxuY2xhc3MgRVJDMTA1NlxuXG5jbGFzcyBFUkMxMDU2T3BlcmF0b3JcblxuY2xhc3MgRVJDNzI1XG5cbmNsYXNzIEVSQzcyNU9wZXJhdG9yXG5cbmNsYXNzIE15TmV3TWV0aG9kXG5jbGFzcyBNeU5ld01ldGhvZE9wZXJhdG9yXG5JUmVzb2x2ZXIgPHwtLSBJT3BlcmF0b3JcblxuSU9wZXJhdG9yIDx8Li4gRVJDMTA1Nk9wZXJhdG9yXG5JT3BlcmF0b3IgPHwuLiBFUkM3MjVPcGVyYXRvclxuSU9wZXJhdG9yIDx8Li4gTXlOZXdNZXRob2RPcGVyYXRvclxuXG5JUmVzb2x2ZXIgPHwuLiBFUkMxMDU2XG5JUmVzb2x2ZXIgPHwuLiBFUkM3MjVcbklSZXNvbHZlciA8fC4uIE15TmV3TWV0aG9kXG5cbkVSQzEwNTYgPHwtLSBFUkMxMDU2T3BlcmF0b3JcbkVSQzcyNSA8fC0tIEVSQzcyNU9wZXJhdG9yXG5NeU5ld01ldGhvZCA8fC0tIE15TmV3TWV0aG9kT3BlcmF0b3JcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In19)

### Pseudo example of implementation
```typescript
// MyResolver - Implement the read only behaviour for your DID Method
class Resolver implements IResolver{
        
    read(){
    // return the whole DID Document
    }
    
    readAttribute(){
    // read an attribute as per did method requirement 
    }
    
    validDelegate(){
    //validate a delegate as per did method requirement
    }

}

// MyResolver - Implement the update and revoke behaviour for your DID Method
class Operator extends Resolver implements IOperator {

    create(){
    //create specific to did method
    }

    update(){
    //update specific to did method
    }

    deactivate(){
    //deactivate specific to did method
    }

    revokeDelegate(){
    //revokeDelegate specific to did method
    }
    
    revokeAttribute(){
    //revoke attribute specific to did method
    }

}
```