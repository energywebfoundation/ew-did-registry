import Ctl from 'ipfsd-ctl';
import path from 'path';
import ipfsHttpModule from 'ipfs-http-client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ipfsd: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function spawnIpfsDaemon(): Promise<any> {
  const ipfsBin = path.resolve(__dirname, '../', 'node_modules/.bin', 'jsipfs');
  ipfsd = await Ctl.createController({
    type: 'js',
    disposable: true,
    test: true,
    ipfsBin,
    ipfsHttpModule,
  });
  return ipfsd.apiAddr;
}

export async function shutDownIpfsDaemon(): Promise<void> {
  return ipfsd && ipfsd.stop();
}
