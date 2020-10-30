import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { Provider } from 'ethers/providers';
import { ethers } from 'ethers';

export function getProvider(settings: ProviderSettings = { type: ProviderTypes.HTTP }): Provider {
  const {
    type, uriOrInfo = 'http://localhost:8544', path, network,
  } = settings;
  switch (type) {
    case ProviderTypes.HTTP:
      return new ethers.providers.JsonRpcProvider(uriOrInfo, network);
    case ProviderTypes.IPC:
      return new ethers.providers.IpcProvider(path, network);
    default:
      throw new Error('Unsupported provider');
  }
}
