import { IDidStore } from '@ew-did-registry/did-store-interface';
import fetch from '@web-std/fetch';
import { FormData } from '@web-std/form-data';
import { Blob } from '@web-std/file';
import { AbortErrorName, ContentNotFound } from './errorrs';
import { IpfsClientOptions } from './ipfs.types';

/**
 * Implements decentralized storage in IPFS
 */
export class DidStore implements IDidStore {
  private headers?: Headers | Record<string, string>;
  private apiPath: string;
  private readonly DEFAULT_GET_TIMEOUT = 30000;
  private readonly DEFAULT_IPFS_API_PATH = 'ipfs';

  private params = this.encodeParams({
    'stream-channels': false,
    'raw-leaves': true,
    'cid-version': 1,
  });
  /**
   * @param baseUrl Base url of IPFS API endpoint
   * @param opts Connection options of endpoint exposing IPFS API. When connecting to IPFS gateway only `get` method should be used
   */
  constructor(private baseUrl: string | URL, opts: IpfsClientOptions = {}) {
    const { headers, apiPath } = opts;
    this.headers = headers;
    this.apiPath = apiPath || this.DEFAULT_IPFS_API_PATH;
  }

  /**
   * @param claim stringified content
   */
  async save(claim: string): Promise<string> {
    const blob = new Blob([claim]);
    const { cid } = await this.add(blob);

    return cid.toString();
  }

  /**
   * Looks up content identified by `cid`. If no content found during `timeout`, then `ContentNotFound` error is thrown.
   * @param cid CID of the content
   * @param timeout time limit for getting response, milliseconds
   * @returns stringified content
   */
  async get(cid: string, timeout = this.DEFAULT_GET_TIMEOUT): Promise<string> {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);

    try {
      const response = await this.request(`${this.apiPath}/${cid}`, {
        method: 'GET',
        signal: controller.signal,
      });
      const status = response.status;
      if (status !== 200) {
        throw new ContentNotFound(cid, response.statusText);
      }
      return response.text();
    } catch (e) {
      if ((<Error>e).name === AbortErrorName) {
        throw new ContentNotFound(cid, `Timeout ${timeout} msec expired`);
      }
      throw e;
    }
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
      const response = await this.request('add', {
        method: 'POST',
        body,
        params: this.params,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = (await response.json())[0];
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
      signal,
    }: {
      method: string;
      body?: FormData;
      params?: Record<string, unknown>;
      signal?: AbortSignal;
    }
  ): Promise<Response> {
    const endpoint = new URL(path, this.baseUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value != null) {
        endpoint.searchParams.set(key, String(value));
      }
    }

    return fetch(endpoint.href, {
      method,
      headers: this.headers,
      body,
      signal,
    });
  }

  private encodeParams(
    options: Record<string, unknown>
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(options).filter(([, v]) => v != null)
    );
  }
}
