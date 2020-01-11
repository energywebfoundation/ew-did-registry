export interface IUpdateParameters {
    value: string | object;
    type?: string;
}
export declare enum Attributes {
    context = "@context",
    id = "id",
    publicKey = "publicKey",
    authentication = "authentication",
    delegates = "delegates",
    service = "service",
    created = "created",
    updated = "updated",
    proof = "proof"
}
