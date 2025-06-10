import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { IDidStore } from "@ew-did-registry/did-store-interface";
import { CID } from "multiformats";
import { sha256 } from "multiformats/hashes/sha2";

/**
 * Implements decentralized storage in S3 Bucket
 */
export class DidStore implements IDidStore {
  private s3: S3Client;
  private bucket: string;

  constructor(bucket: string, s3Config: S3ClientConfig) {
    this.s3 = new S3Client(s3Config);
    this.bucket = bucket;
  }

  private async computeCid(claim: string): Promise<CID> {
    const bytes = new TextEncoder().encode(claim);
    const hash = await sha256.digest(bytes);
    return CID.create(1, 0x55, hash); // raw codec
  }

  /**
   * @param claim stringified content
   */
  async save(claim: string): Promise<string> {
    const cid = await this.computeCid(claim);
    const key = cid.toString();
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: claim,
        ContentType: "text/plain",
      })
    );
    return key;
  }

  /**
   * Looks up content identified by `cid`. If no content found during `timeout`, then `ContentNotFound` error is thrown.
   * @param cid CID of the content
   * @param timeout time limit for getting response, milliseconds
   * @returns stringified content
   */
  async get(uri: string): Promise<string> {
    const res = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: uri,
      })
    );

    const chunks: Uint8Array[] = [];
    for await (const chunk of res.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk instanceof Uint8Array ? chunk : Uint8Array.from(chunk as ArrayLike<number>));
    }
    return new TextDecoder().decode(Uint8Array.from(chunks.flatMap(arr => Array.from(arr))));
  }


  async delete(uri: string): Promise<boolean> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: uri,
        })
      );
      return true;
    } catch (err: any) {
      if (err.name === "NoSuchKey") return false;
      throw err;
    }
  }
}
