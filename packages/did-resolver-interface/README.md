## DID Resolver Interface
EW-DID library has a design goal to support different DID methods. `did-document` allows management of keys, authorisation, delegation and service endpoints in standardised way. In the practical scenario, the CRUD behaviour of the `did-document` needs to be specific to the DID method's underlying implementation. EW-DID aims to handle this through the DID method specific resolver implementation. 

`did-resolver-interface` defines the contract required for CRUD behaviour of the `did-document`. [did-ethr-resolver](/packages/did-ethr-resolver) provides a reference implemention of ERC 1056 standard.

### Class Diagram
[![](https://mermaid.ink/img/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cbmNsYXNzIElSZXNvbHZlcntcbiAgICA8PGludGVyZmFjZT4-XG4gICAgSVJlc29sdmVyU2V0dGluZ3NcbiAgICBjcmVhdGUoKVxuICAgIHVwZGF0ZSgpXG4gICAgcmVhZCgpXG4gICAgZGVhY3RpdmF0ZSgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5cbmNsYXNzIEVSQzEwNTZ7XG4gICAgSVJlc29sdmVyU2V0dGluZ3NcbiAgICBjcmVhdGUoKVxuICAgIHVwZGF0ZSgpXG4gICAgcmVhZCgpXG4gICAgZGVhY3RpdmF0ZSgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5cbmNsYXNzIEVSQzcyNXtcbiAgICBJUmVzb2x2ZXJTZXR0aW5nc1xuICAgIGNyZWF0ZSgpXG4gICAgdXBkYXRlKClcbiAgICByZWFkKClcbiAgICBkZWFjdGl2YXRlKClcbiAgICByZXZva2VEZWxlZ2F0ZSgpXG4gICAgcmV2b2tlQXR0cmlidXRlKClcbn1cblxuY2xhc3MgTXlOZXdNZXRob2R7XG4gICAgSVJlc29sdmVyU2V0dGluZ3NcbiAgICBjcmVhdGUoKVxuICAgIHVwZGF0ZSgpXG4gICAgcmVhZCgpXG4gICAgZGVhY3RpdmF0ZSgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5cbklSZXNvbHZlciA8fC4uIEVSQzEwNTZcbklSZXNvbHZlciA8fC4uIEVSQzcyNVxuSVJlc29sdmVyIDx8Li4gTXlOZXdNZXRob2RcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cbmNsYXNzIElSZXNvbHZlcntcbiAgICA8PGludGVyZmFjZT4-XG4gICAgSVJlc29sdmVyU2V0dGluZ3NcbiAgICBjcmVhdGUoKVxuICAgIHVwZGF0ZSgpXG4gICAgcmVhZCgpXG4gICAgZGVhY3RpdmF0ZSgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5cbmNsYXNzIEVSQzEwNTZ7XG4gICAgSVJlc29sdmVyU2V0dGluZ3NcbiAgICBjcmVhdGUoKVxuICAgIHVwZGF0ZSgpXG4gICAgcmVhZCgpXG4gICAgZGVhY3RpdmF0ZSgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5cbmNsYXNzIEVSQzcyNXtcbiAgICBJUmVzb2x2ZXJTZXR0aW5nc1xuICAgIGNyZWF0ZSgpXG4gICAgdXBkYXRlKClcbiAgICByZWFkKClcbiAgICBkZWFjdGl2YXRlKClcbiAgICByZXZva2VEZWxlZ2F0ZSgpXG4gICAgcmV2b2tlQXR0cmlidXRlKClcbn1cblxuY2xhc3MgTXlOZXdNZXRob2R7XG4gICAgSVJlc29sdmVyU2V0dGluZ3NcbiAgICBjcmVhdGUoKVxuICAgIHVwZGF0ZSgpXG4gICAgcmVhZCgpXG4gICAgZGVhY3RpdmF0ZSgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5cbklSZXNvbHZlciA8fC4uIEVSQzEwNTZcbklSZXNvbHZlciA8fC4uIEVSQzcyNVxuSVJlc29sdmVyIDx8Li4gTXlOZXdNZXRob2RcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

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