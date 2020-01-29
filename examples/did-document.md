# DID document examples

## 1. Seting up DID document attribute

```typescript
const ownerAddress = '0xed6011BBaB3B98cF955ff271F52B12B94BF9fD28';
  const did = `did:ewc:${ownerAddress}`;
  const keys = new Keys({
    privateKey: '0b4e103fe261142b716fc5c055edf1e70d4665080395dbe5992af03235f9e511',
    publicKey: '02963497c702612b675707c0757e82b93df912261cd06f6a51e6c5419ac1aa9bcc',
  });
  const operator = new Operator(keys);
```
DIDDocumentFull provide full CRUD functionality
```typescript
  const document = new DIDDocumentFull(did, operator);
```
Await for document initializing - setting default public key
```typescript
  const created = await document.create();
  const validity = 5 * 60 * 1000;
```
Now the document is ready to use

## 2. Adding public key to DID document
```typescript
  const updated = await document.update(
  DIDAttribute.PublicKey,
  {
    type: PubKeyType.VerificationKey2018,
    algo: Algorithms.ED25519,
    encoding: Encoding.HEX,
    value: new Keys().publicKey,
  },
  validity,
);
```

## 3. DID document deactivation

```typescript
  const deactivated = await document.deactivate();
```

## 4. Reading Secp256k1VerificationKey public key
```typescript
  const publicKey = await document.read(Attributes.publicKey, 'Secp256k1VerificationKey');
```
