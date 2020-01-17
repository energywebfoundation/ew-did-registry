import { IKeys } from "@ew-did-registry/keys";
import { IResolver } from "@ew-did-registry/did-resolver";
import { DIDDocumentFactory } from "@ew-did-registry/did-document";

class Registry {
    public claims: IClaimUser | IClaimVerifier | IClaimIssuer;
    
    private roleClaim = {
        [Roles.User]: ClaimFactory.createUserClaim,
    }

    constructor(keys: IKeys, role: [Roles.User], resolver: IResolver) {
        this.didDocument = DIDDocumentFactory.createLite(resolver);
        this.claims = this.roleClaim[role](keys, this.didDocument);
    }
}

instance.claims.verify(token);

const document = this.didDocument.read(token.did);