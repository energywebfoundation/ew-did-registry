import { IDidStore } from '@ew-did-registry/did-store-interface';
import fetch from '@web-std/fetch';
import { FormData } from '@web-std/form-data';
import { Blob } from '@web-std/file';
import axios from 'axios';
import { values } from 'lodash';
import {
  AddResponse,
  PinResponse,
  StatusResponse,
  TrackerStatus,
  PIN_TIMEOUT,
  REPLICATION,
} from './ipfs.types';
import { waitFor } from './utils';

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
   * @param waitForPinned checker of claim availability. Replication of claim requires time. This parameter allows to configure degree of availability after `save` returns. By default `save` waits until claim is pinned on `replication_factor_min` nodes
   */
  async save(
    claim: string,
    waitForPinned?: (cid: string) => Promise<void>
  ): Promise<string> {
    const blob = new Blob([claim]);
    let { cid } = await this.add(blob);
    cid = cid.toString();

    if (!waitForPinned) {
      waitForPinned = async (cid) => await this.waitForPinned(cid);
    }
    await waitForPinned(cid);

    return cid;
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
   * @param replicationFactor specifies on how many nodes data should be pinned https://ipfscluster.io/documentation/guides/pinning/#replication-factors
   */
  async isPinned(cid: string, replicationFactor = REPLICATION.MIN): Promise<boolean> {
    const { replication_factor_min, replication_factor_max } =
      await this.allocations(cid);
    const expectedReplicationFactor =
      replicationFactor === REPLICATION.LOCAL
        ? 1
        : replicationFactor === REPLICATION.MIN
        ? replication_factor_min
        : replication_factor_max;

    return (
      values((await this.status(cid)).peer_map).filter(
        (pinInfo) => pinInfo.status === TrackerStatus.Pinned
      ).length >= expectedReplicationFactor
    );
  }

  /**
   * Returns pin status
   * @param cid The CID to get pin status information for
   */
  async status(cid: string): Promise<StatusResponse> {
    const path = `pins/${cid}`;

    const data = await this.request<StatusResponse>(path, {
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
      const result = await this.request<AddResponse[]>('add', {
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

  private async waitForPinned(cid: string): Promise<void> {
    await waitFor(async () => await this.isPinned(cid), {
      timeout: PIN_TIMEOUT * 1000,
    });
  }

  private async request<T>(
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
      return (await response.json()) as T;
    } else {
      throw new Error(
        `Can not perform ${method} on endpoint ${endpoint.href}:${response.status}: ${response.statusText}`
      );
    }
  }

  private async allocations(cid: string): Promise<PinResponse> {
    const path = `allocations/${cid}`;
    return this.request(path, { method: 'GET', params: this.params });
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
