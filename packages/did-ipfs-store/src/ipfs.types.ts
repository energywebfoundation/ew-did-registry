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
