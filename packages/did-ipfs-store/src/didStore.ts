import { Cluster } from '@nftstorage/ipfs-cluster';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import fetch from '@web-std/fetch';
import { FormData } from '@web-std/form-data';
import { File, Blob } from '@web-std/file';
import axios from 'axios';

Object.assign(global, { fetch, File, Blob, FormData });

/**
 * Implements decentralized storage in IPFS cluster. Storing data in cluster allows to provide required degree of data availability
 */
export class DidStore implements IDidStore {
  private cluster: Cluster | undefined;

  /**
   * @param url Ipfs cluster root
   * @param headers Http request headers
   */
  constructor(
    private url: string,
    private headers: Record<string, string> = {}
  ) {}

  async save(claim: string): Promise<string> {
    const cluster = await this.getCluster();
    const blob = new Blob([claim]);
    const { cid } = await cluster.add(blob);
    return cid.toString();
  }

  async get(cid: string): Promise<string> {
    const { data: content } = await axios.get(`${this.url}/ipfs/${cid}`, {
      headers: this.headers,
    });
    return Buffer.from(content).toString();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(cid: string): Promise<boolean> {
    throw new Error('Not supported yet');
  }

  /**
   * Imports ESM module `ipfs-cluster` from commonjs https://www.typescriptlang.org/docs/handbook/esm-node.html
   */
  private async getCluster() {
    if (!this.cluster) {
      const { Cluster } = await (eval(
        `import('@nftstorage/ipfs-cluster')`
      ) as Promise<typeof import('@nftstorage/ipfs-cluster')>);

      this.cluster = new Cluster(this.url, { headers: this.headers });
    }
    return this.cluster;
  }
}
