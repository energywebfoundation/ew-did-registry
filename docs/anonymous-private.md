# Creating approved claims that are universally private

In the DID standard a claim signed by the issuer and the approver can be added to an identity and presented as proof. No one, to the exception of the issuer and the approver, can trace the private version of the claim back to its content. If the claim is properly encoded (e.g. in a merkle tree) it is possible to selectively disclose information and preserve the ability to verify the correctness of the approval.

But if the claim should be kept secret from all, including the approver, we run into a challenge. How to create a proof that even the approver can not recognize. There are two possible solutions:

1. The approver can delegate the signature of the approval to a third party and thus remove the temptation to store the proof for future reference.
1. The issuer create a zero knowledge version of the proof.

## Delegating approval 

In this document we will concentrate on the first solution: delegating the signature to a trusted third party.

Authorizing the third party to sign on behalf of the `Organization` until the delegation is revoked is a major security risk for the `Organization` which requires a lot of trust. This is why we propose to setup the third party in a secure [SGX enclave](https://en.wikipedia.org/wiki/Software_Guard_Extensions). 

As SGX is certified by Intel, Intel serves as the guarantor and hence the source of trust. But Intel does not have the power to reveal any information, it does only certify that the software deployed to the enclave is correct.

### Process

The following diagrams depict the sequence of events which allow to create a fully anonymous private claim.

````mermaid
sequenceDiagram
    participant org as Organization
    participant sgx as SGX Enclave

    org->>org:Generate DID
    
    org->>sgx:Request delegate

    sgx->>sgx:Generate delegate DID
    sgx->>sgx:Store DID in encrypted storage

    sgx-->>org:Delegate DID public key

    org->>org:Add delegate DID as signing delegate

````

The trust issue aside, this solution allows us to create an approved claim which the approver will have no knowledge of:

````mermaid
sequenceDiagram
    participant usr as End User
    participant sgx as SGX Enclave
    participant org as Organization

    usr->>usr:Issue a self signed claim

    usr->>sgx:Request Approval of claim
    sgx->>org:Forward Attributes in claim
    Note over sgx,org:The issuer's signature is not sent
    org->>org:Review claim data
    alt Claim can be approved
        org-->>sgx:Approve claim
        sgx->>sgx:Create merkle tree
        sgx->>sgx:Sign merkle Root
        sgx-->>usr:Approved private claim
    else Claim must be rejected
        org-->>sgx:Reject claim
        sgx-->>usr:Rejection message
    end
````

What can be seen in this sequence is that the Organization keeps control over which claim gets approved and which get rejected, as the data is submitted to its review. But because the merkle proof and the signature happen in the SGX Enclave there is no way for the organization to link the end-user and their claim.

The result is that the end-user can present the claim to the organization without giving the organization the ability to recognize them. They can reveal only the parts of the claim which are relevant to the process they want to participate in without revealing any identifying information.

## Use Case

The first use case is enrolling EV drivers in a subsidy scheme without knowing who the drivers are but making sure that each driver can only enroll once.

When the driver sends information to claim subsidy they include:

* Proof of charge operation. I.e. CDR with signature from CPO
* Anonymous proof of enrollment in program 
* EWC address to transfer the reward to 

````mermaid
sequenceDiagram
    participant usr as End User
    participant org as Organization

    usr->>org:Send miles driven together with enrollment proof
    note over usr,org:no user data needs to be disclosed
    org->>org:verify enrollment claim
    org->>org:store miles driven claim and associated enrollment
    org->>org:transfer stable coins 
    org-->>usr:transaction hash
````

The organization can verify that

* Only enrolled users can submit requests
* A request can not be submitted twice in the same time period
    * The session ID from te CDR can be checked
    * The enrollment proof serves as unique identifier for the anonymous user
* It can not discover the user's identity with the EWC address where the tokens are sent to

This process allows for a fully anonymous and secure with no need for a trusted party. 
