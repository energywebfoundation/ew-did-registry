// import { IDidStore } from '@ew-did-registry/did-store-interface';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import type { IPFSHTTPClient, Options } from 'ipfs-http-client';

export class DidStore implements IDidStore {
  private client: IPFSHTTPClient | undefined;
  /**
   * @param opts {string | Options} - IPFS client options
   */
  constructor(private readonly opts: string | Options) {}

  async save(claim: string): Promise<string> {
    const client = await this.getClient();
    const { cid } = await client.add(claim);
    return cid.toString();
  }

  /**
   * @param uri {string} CID of the file with claim content
   */
  async get(uri: string): Promise<string> {
    const client = await this.getClient();
    const chunks = [];
    let len = 0;
    for await (const chunk of client.cat(`/ipfs/${uri}`)) {
      chunks.push(chunk);
      len += chunk.length;
    }
    const content = new Uint8Array(len);
    let offset = 0;
    for (const chunk of chunks) {
      content.set(chunk, offset);
      offset += chunk.length;
    }
    return Buffer.from(content).toString();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(uri: string): Promise<boolean> {
    throw new Error('Not supported yet');
  }

  private async getClient() {
    if (!this.client) {
      // to prevent compilation of `import` to `require` when resolving esm module ipfs-http-client
      // https://github.com/microsoft/TypeScript/issues/43329
      const { create } = await (eval(`import('ipfs-http-client')`) as Promise<
        typeof import('ipfs-http-client')
      >);
      this.client = create(
        typeof this.opts === 'string' ? { url: this.opts } : this.opts
      );
    }
    return this.client;
  }
}
