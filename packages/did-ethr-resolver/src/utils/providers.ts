import {
  ProviderSettings,
  ProviderTypes,
} from '@ew-did-registry/did-resolver-interface';
import { JsonRpcProvider, IpcProvider } from '@ethersproject/providers';
import { Provider } from '@ethersproject/abstract-provider';

export function getProvider(
  settings: ProviderSettings = { type: ProviderTypes.HTTP }
): Provider {
  const { type, uriOrInfo = 'http://localhost:8544', path, network } = settings;
  switch (type) {
    case ProviderTypes.HTTP:
      return new JsonRpcProvider(uriOrInfo, network);
    case ProviderTypes.IPC:
      return new IpcProvider(path as string, network);
    default:
      throw new Error('Unsupported provider');
  }
}
