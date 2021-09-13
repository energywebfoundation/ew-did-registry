# Operator User Guide

Operator is the implementation of ERC1056 standard. It exposes full CRUD methodology.
In addition to 4 CRUD methods, one can explicitly revoke attribute, revoke delegate,
and change owner, which have been implemented for user convenience, in particular.

* **Importing required modules**

``` typescript
import { Keys } from '@ew-did-registry/keys';
import { 
    Algorithms,
    DIDAttribute,
    Encoding,
    IUpdateData,
    PubKeyType,
    Operator,
    IAuthentication,
} from '@ew-did-registry/did-resolver';
```

* **DID Document is read similarly to resolver**

``` typescript
    const keys = new Keys();
    const signer = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);
    const operator = new Operator(signer, registrySettings);
    const didDocument = await operator.read(did);
```

* **DID Creation involves transaction on the BlockChain, so make sure balance is positive**

``` typescript
    const keys = new Keys();
    const signer = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);
    const operator = new Operator(signer, registrySettings);
    const didDocument = await operator.create();
```

* **DID Attribute update involves transaction on the BlockChain, so make sure balance is positive**

``` typescript
    const keys = new Keys();
    const signer = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);
    const operator = new Operator(signer, registrySettings);
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: new Keys().publicKey,
    };
    await operator.update(did, attribute, updateData, validity);
```

* **Revocation of delegates**

``` typescript
    const delegateDid = `did:ewc:${delegate.address}`;
    const revoked = await operator.revokeDelegate(did, PubKeyType.VerificationKey2018, delegateDid);
```

* **Revocation of attributes**

``` typescript
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: keysAttribute.publicKey,
    };
    const revoked = await operator.revokeAttribute(did, attribute, updateData);
```    

* **Change of ownership**

``` typescript
    const identityNewOwner = '0xe8Aa15Dd9DCf8C96cb7f75d095DE21c308D483F7';
    await operator.changeOwner(`did:ewc:${identity}`, `did:ewc:${identityNewOwner}`);
```     

* **Deactivation of DID Document**

``` typescript
    await operator.deactivate(did);
```
