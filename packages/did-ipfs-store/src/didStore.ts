/* eslint-disable no-restricted-syntax */
import ipfsClient from 'ipfs-http-client';
import BufferList from 'bl';
import { IDidStore } from '@ew-did-registry/did-store-interface';

export class DidStore implements IDidStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ipfs: any;

  /**
   * @param uri {string} - IPFS API server uri
   */
  constructor(uri: string | object) {
    this.ipfs = ipfsClient(uri);
  }

  async save(claim: string): Promise<string> {
    const asyncChunks = await this.ipfs.add(claim);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cid: any;
    for await (const chunk of asyncChunks) {
      cid = chunk.cid; // return cid from last (and only one) chunk
    }
    return cid.toString();
  }

  /**
   * @param uri {string} CID of the file with claim content
   */
  async get(uri: string): Promise<string> {
    let claim = '';
    for await (const file of this.ipfs.get(`/ipfs/${uri}`)) {
      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      claim += content.toString();
    }
    return claim;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(uri: string): Promise<boolean> {
    throw new Error('Not supported by IPFS');
  }
}
