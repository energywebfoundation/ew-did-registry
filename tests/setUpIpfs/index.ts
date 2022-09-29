import { execFile, execFileSync, ChildProcess } from 'child_process';
import path from 'path';
import waitOn from 'wait-on';

/**
 * Spawn local ipfs cluster
 *
 * @returns uri of the cluster root
 */
export async function spawnIpfs() {
  shudownNodes();

  const cluster = execFile(
    'docker',
    ['compose', 'up', '--force-recreate', 'cluster_proxy'],
    { cwd: path.join(__dirname) },
    (error) => {
      if (error) {
        throw error;
      }
    }
  );

  try {
    await waitOn({
      // https://ipfscluster.io/documentation/reference/api/
      resources: ['http-get://localhost:8080/id'],
      delay: 5000,
      timeout: 30000,
    });

    return cluster;
  } catch (error) {
    shutdownIpfs(cluster);
    throw error;
  }
}

export function shutdownIpfs(cluster?: ChildProcess) {
  shudownNodes();

  if (cluster !== undefined) {
    cluster.kill();
  }
}

function shudownNodes() {
  execFileSync('docker', ['compose', 'down'], {
    cwd: path.join(__dirname),
    stdio: 'pipe',
  });
}
