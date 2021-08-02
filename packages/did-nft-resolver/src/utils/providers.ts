import { ProviderSettings, ProviderTypes } from '@fl-did-registry/did-resolver-interface';
import { providers } from 'ethers';

const { JsonRpcProvider, IpcProvider } = providers;

export function getProvider(
  settings: ProviderSettings = { type: ProviderTypes.HTTP },
): providers.Provider {
  const {
    type, uriOrInfo = 'http://localhost:8544', path, network,
  } = settings;
  switch (type) {
    case ProviderTypes.HTTP:
      return new JsonRpcProvider(uriOrInfo, network);
    case ProviderTypes.IPC:
      return new IpcProvider(path as string, network);
    default:
      throw new Error('Unsupported provider');
  }
}
