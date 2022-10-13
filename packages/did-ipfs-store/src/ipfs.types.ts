export type StatusResponse = {
  cid: string;
  name: string;
  peer_map: Record<string, PinInfo>;
};

export type PinInfo = {
  peername: string;
  ipfs_peer_id: string;
  status: TrackerStatus;
  timestamp: Date;
  error?: string;
};

export enum TrackerStatus {
  Pinned = 'pinned',
}

export type PinResponse = {
  replication_factor_min: number;
  replication_factor_max: number;
};

export type AddResponse = {
  cid: string;
  name?: string;
  size?: number | string;
  bytes?: number | string;
};

export enum REPLICATION {
  LOCAL,
  MIN,
  MAX,
}

export const PIN_TIMEOUT = 3;
