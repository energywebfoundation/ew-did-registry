import { IDidStore } from "@ew-did-registry/did-store-interface";
import { CacheClient, CacheClientConfig } from "./cacheCache";

/**
 * Implements decentralized storage in S3 Bucket
 */
export class DidStore implements IDidStore {
  private client: CacheClient;

  constructor(cacheConfig: CacheClientConfig) {
    this.client = new CacheClient(cacheConfig);
  }

  /**
   * @param claim stringified content
   */
  async save(claim: string): Promise<string> {
    const res = await this.client.post("/v1/s3", { data: claim });
    return res.data;
  }

  /**
   * Looks up content identified by `cid`. If no content found during `timeout`, then `ContentNotFound` error is thrown.
   * @param cid CID of the content
   * @param timeout time limit for getting response, milliseconds
   * @returns stringified content
   */
  async get(uri: string): Promise<string> {
    const res = await this.client.get(`/v1/s3/${uri}`);
    return res.data;
  }


  async delete(uri: string): Promise<boolean> {
    try {
      return false;
    } catch (err: any) {
      if (err.name === "NoSuchKey") return false;
      throw err;
    }
  }
}
