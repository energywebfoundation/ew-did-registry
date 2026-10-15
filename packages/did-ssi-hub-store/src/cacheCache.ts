import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRetry from "axios-retry";
import base64url from 'base64url';
import { utils, Wallet } from 'ethers';

export interface BaseCacheClientConfig {
  baseURL: string;
  privateKey: string;
}

export type CacheClientConfig =
  | (BaseCacheClientConfig & { didPrefix: string; did?: undefined })
  | (BaseCacheClientConfig & { didPrefix?: undefined; did: string });

export class CacheClient {
  private loginEndpoint: string;
  private refreshEndpoint: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private signer: Wallet;
  private did: string;
  private identityToken: string | null = null;
  public api: AxiosInstance;

  constructor(config: CacheClientConfig) {
    this.signer = new Wallet(config.privateKey);
    this.did = config.did ? config.did : this.ensureDidPrefixSuffix(config.didPrefix!) + this.signer.address;
    this.loginEndpoint = config.baseURL + '/login';
    this.refreshEndpoint = config.baseURL + '/refresh_token';

    this.api = axios.create({ baseURL: config.baseURL });

    axiosRetry(this.api as any, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: err =>
        axiosRetry.isNetworkOrIdempotentRequestError(err) ||
        Boolean(err.response && err.response.status >= 500 && err.response.status < 600),
    });

    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (!this.accessToken) {
          await this._login();
        }
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${this.accessToken}`;
        return config;
      }
    );

    this.api.interceptors.response.use(
      res => res,
      err => this._handle401(err)
    );
  }

  private ensureDidPrefixSuffix(didPrefix: string): string {
    return didPrefix.endsWith(':') ? didPrefix : didPrefix + ':';
  }


  private async _login() {
    await this.createIdentityToken();
    const res = await axios.post(
      this.loginEndpoint,
      { identityToken: this.identityToken },
      {
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    this.accessToken = res.data.token;
    this.refreshToken = res.data.refreshToken;
  }

  private async _refresh() {
    const res = await axios.post(this.refreshEndpoint, {
      refreshToken: this.refreshToken,
    });
    // Try both field names, prefer token if present
    this.accessToken = res.data.token || res.data.accessToken;
    this.refreshToken = res.data.refreshToken || this.refreshToken;
  }

  private async _handle401(err: AxiosError) {
    const original = err.config as AxiosRequestConfig & { _retry?: boolean };
    if (err.response && err.response.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await this._refresh();
      } catch {
        await this._login();
      }
      if (original.headers) {
        (original.headers as any).Authorization = "Bearer " + this.accessToken;
      }
      return this.api(original);
    }
    return Promise.reject(err);
  }

  private async createIdentityToken(): Promise<void> {
    const header = {
      alg: 'ES256',
      typ: 'JWT',
    };
    const encodedHeader = base64url(JSON.stringify(header));
    const ttl: number = 1000 * 5;
    const payload = {
      iss: this.did,
      claimData: {
        blockNumber: 999999999999,
      },
      iat: Math.floor(Date.now() / 1000), // Current
      exp: Math.floor(Date.now() / 1000) + ttl  // Expires in 5 minutes
    };

    const encodedPayload = base64url(JSON.stringify(payload));
    const message = utils.arrayify(
      utils.keccak256(Buffer.from(`${encodedHeader}.${encodedPayload}`))
    );
    const sig = await this.signer.signMessage(message);
    const encodedSig = base64url(sig);

    this.identityToken = `${encodedHeader}.${encodedPayload}.${encodedSig}`;
  }

  // Helper HTTP methods
  get<T = any>(...a: Parameters<AxiosInstance["get"]>) { return this.api.get<T>(...a); }
  post<T = any>(...a: Parameters<AxiosInstance["post"]>) { return this.api.post<T>(...a); }
  put<T = any>(...a: Parameters<AxiosInstance["put"]>) { return this.api.put<T>(...a); }
  delete<T = any>(...a: Parameters<AxiosInstance["delete"]>) { return this.api.delete<T>(...a); }
}