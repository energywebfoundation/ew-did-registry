import { IDidStore } from '@ew-did-registry/did-store-interface';
import fetch from '@web-std/fetch';
import { FormData } from '@web-std/form-data';
import { File, Blob } from '@web-std/file';
import axios from 'axios';
import { values } from 'lodash';
import { StatusResponse, TrackerStatus } from './ipfs.types';

Object.assign(global, { fetch, File, Blob, FormData });

/**
 * Implements decentralized storage in IPFS cluster. Storing data in cluster allows to provide required degree of data availability
 */
export class DidStore implements IDidStore {
  private params = this.encodeParams({
    ...this.encodePinOptions(),
    'stream-channels': false,
    'raw-leaves': true,
    'cid-version': 1,
  });
  /**
   * @param url Ipfs cluster root
   * @param headers Http request headers
   */
  constructor(
    private url: string,
    private headers: Record<string, string> = {}
  ) {}

  /**
   * @param claim stringified claim. Supported types of claim content are `string` and `object`
   * @param pinTimeout Defines how to long to wait for pinning completion before throwing error, seconds
   */
  async save(claim: string, pinTimeout = 5): Promise<string> {
    const blob = new Blob([claim]);
    const { cid } = await this.add(blob);

    const { default: waitFor } = await (eval('import(`p-wait-for`)') as Promise<
      typeof import('p-wait-for')
    >);

    await waitFor(async () => await this.isPinned(cid), {
      timeout: { milliseconds: pinTimeout * 1000 },
    });

    return cid.toString();
  }

  async get(cid: string): Promise<string> {
    const { data: content } = await axios.get(`${this.url}/ipfs/${cid}`, {
      headers: this.headers,
    });

    switch (typeof content) {
      case 'string':
        return content;
      case 'object':
        return JSON.stringify(content);
      default:
        throw new Error('Unsupported claim content type');
    }
  }

  /**
   * Checks if file is pinned on cluster
   * @param cid CID
   */
  async isPinned(cid: string): Promise<boolean> {
    return values((await this.status(cid)).peer_map).some(
      (pinInfo) => pinInfo.status === TrackerStatus.Pinned
    );
  }

  /**
   * Returns pin status
   * @param cid The CID to get pin status information for
   */
  async status(cid: string): Promise<StatusResponse> {
    const path = `pins/${cid}`;

    const data = await this.request(path, {
      method: 'GET',
      params: this.params,
    });
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(cid: string): Promise<boolean> {
    throw new Error('Not supported yet');
  }

  // Inspired by https://github.com/nftstorage/ipfs-cluster/blob/02a4c1d0f4cbe86557abd738be83bb2de25ccec0/src/index.js#L63
  private async add(file: File | Blob) {
    const body = new FormData();
    body.append('file', file);
    try {
      const result = await this.request('add', {
        method: 'POST',
        body,
        params: this.params,
      });
      const data = result[0];
      return { ...data, cid: data.cid };
    } catch (err) {
      const error = err as Error & { response?: Response };
      if (error?.response?.ok) {
        throw new Error(
          `failed to parse response body from cluster add ${error?.stack}`
        );
      } else {
        throw error;
      }
    }
  }

  private async request(
    path: string,
    {
      method,
      body,
      params = {},
    }: {
      method: string;
      body?: FormData;
      params?: Record<string, unknown>;
    }
  ) {
    const endpoint = new URL(path, this.url);
    for (const [key, value] of Object.entries(params)) {
      if (value != null) {
        endpoint.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(endpoint.href, {
      method,
      headers: this.headers,
      body,
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `Can not perform ${method} on endpoint ${endpoint.href}:${response.status}: ${response.statusText}`
      );
    }
  }

  private encodeParams(
    options: Record<string, unknown>
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(options).filter(([, v]) => v != null)
    );
  }

  private encodePinOptions() {
    return this.encodeParams({
      ...this.encodeMetadata(),
    });
  }

  private encodeMetadata(metadata: Record<string, string> = {}) {
    return Object.fromEntries(
      Object.entries(metadata).map(([k, v]) => [`meta-${k}`, v])
    );
  }
}
