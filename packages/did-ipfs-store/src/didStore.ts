/* eslint-disable no-restricted-syntax */
import { create } from 'ipfs-http-client';
import BufferList from 'bl';
import { IDidStore } from '@fl-did-registry/did-store-interface';

export class DidStore implements IDidStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ipfs: any;

  /**
   * @param uri {string} - IPFS API server uri
   */
  constructor(uri: string | object) {
    this.ipfs = create(uri);
  }

  async save(claim: string): Promise<string> {
    const {cid} = await this.ipfs.add(claim);
    return cid.toString();
  }

  /**
   * @param uri {string} CID of the file with claim content
   */
  async get(uri: string): Promise<string> {
    let claim = '';
    for await (const content of this.ipfs.cat(`/ipfs/${uri}`)) {
      claim += content.toString();
    }
    return claim;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(uri: string): Promise<boolean> {
    throw new Error('Not supported by IPFS');
  }
}
