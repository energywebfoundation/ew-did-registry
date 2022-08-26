import path from 'path';
import type { Controller } from 'ipfsd-ctl';

let ipfsDaemon: Controller;

/**
 * Spawn local ipfs
 *
 * @returns address of spawned ipfs daemon
 */
export async function spawnIpfsDaemon(): Promise<string> {
  // https://github.com/microsoft/TypeScript/issues/43329
  const ipfsHttpModule = await (eval(`import('ipfs-http-client')`) as Promise<
    typeof import('ipfs-http-client')
  >);
  const ipfsBin = path.resolve(__dirname, '../', 'node_modules/.bin', 'jsipfs');
  const Ctl = await (eval(`import('ipfsd-ctl')`) as Promise<
    typeof import('ipfsd-ctl')
  >);
  ipfsDaemon = await Ctl.createController({
    type: 'js',
    disposable: true,
    test: true,
    ipfsBin,
    ipfsHttpModule,
  });
  return ipfsDaemon.apiAddr.toString();
}

export async function shutDownIpfsDaemon(): Promise<void> {
  if (ipfsDaemon !== undefined) {
    ipfsDaemon.stop();
  }
}
